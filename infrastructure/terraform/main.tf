# Terraform Infrastructure for Medical Admission Platform
# Main configuration file

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket         = "medical-platform-tfstate"
    key            = "terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.region
  
  default_tags {
    tags = {
      Project     = "medical-admission-platform"
      Environment = var.environment
      ManagedBy   = "terraform"
      CostCenter  = "engineering"
      Owner       = "platform-team"
    }
  }
}

# Variables
variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "instance_count" {
  description = "Number of ECS service instances"
  type        = number
  default     = 2
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# VPC Module
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "medical-platform-${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["${var.region}a", "${var.region}b", "${var.region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = var.environment != "prod"
  enable_dns_hostnames   = true
  enable_dns_support     = true
  enable_ipv6           = false

  tags = {
    Environment = var.environment
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "medical-platform-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"
      log_configuration {
        cloud_watch_log_group_name = aws_cloudwatch_log_group.ecs_exec.name
      }
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 1
    capacity_provider = "FARGATE"
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "ecs_exec" {
  name              = "/ecs/medical-platform-${var.environment}/exec"
  retention_in_days = var.environment == "prod" ? 30 : 7
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/medical-platform-${var.environment}/api"
  retention_in_days = var.environment == "prod" ? 30 : 7
}

# ECR Repository
resource "aws_ecr_repository" "api" {
  name                 = "medical-platform/api-${var.environment}"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
  }

  force_delete = var.environment != "prod"
}

resource "aws_ecr_lifecycle_policy" "api" {
  repository = aws_ecr_repository.api.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 30 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 30
      }
      action = {
        type = "expire"
      }
    }]
  })
}

# Security Groups
resource "aws_security_group" "alb" {
  name_prefix = "medical-platform-alb-${var.environment}"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "medical-platform-alb-${var.environment}"
  }
}

resource "aws_security_group" "ecs" {
  name_prefix = "medical-platform-ecs-${var.environment}"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "medical-platform-ecs-${var.environment}"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "medical-platform-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = module.vpc.public_subnets

  enable_deletion_protection = var.environment == "prod"
  enable_http2              = true

  tags = {
    Name = "medical-platform-${var.environment}"
  }
}

resource "aws_lb_target_group" "api" {
  name        = "medical-platform-api-${var.environment}"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 3
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "api" {
  family                   = "medical-platform-api-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = "api"
    image = "${aws_ecr_repository.api.repository_url}:latest"
    essential = true
    
    portMappings = [{
      containerPort = 3001
      protocol      = "tcp"
    }]

    environment = [
      {
        name  = "NODE_ENV"
        value = var.environment
      },
      {
        name  = "PORT"
        value = "3001"
      }
    ]

    secrets = [
      {
        name      = "DATABASE_URL"
        valueFrom = aws_secretsmanager_secret.app_secrets.arn
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.api.name
        "awslogs-region"        = data.aws_region.current.name
        "awslogs-stream-prefix" = "api"
      }
    }

    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])
}

# ECS Service
resource "aws_ecs_service" "api" {
  name            = "api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = var.instance_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 3001
  }

  deployment_controller {
    type = "ECS"
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  depends_on = [aws_lb_listener.http]
}

# Auto-scaling
resource "aws_appautoscaling_target" "api" {
  max_capacity       = var.environment == "prod" ? 10 : 3
  min_capacity       = var.instance_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "api_cpu" {
  name               = "api-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# IAM Roles
resource "aws_iam_role" "ecs_execution" {
  name = "medical-platform-ecs-execution-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_execution_secrets" {
  name = "medical-platform-ecs-execution-secrets-${var.environment}"
  role = aws_iam_role.ecs_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue"
      ]
      Resource = aws_secretsmanager_secret.app_secrets.arn
    }]
  })
}

resource "aws_iam_role" "ecs_task" {
  name = "medical-platform-ecs-task-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

# Secrets Manager
resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "medical-platform/${var.environment}/app"
  description             = "Application secrets for ${var.environment}"
  recovery_window_in_days = var.environment == "prod" ? 30 : 0
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    database_url             = "placeholder"
    jwt_access_secret        = "placeholder"
    jwt_refresh_secret       = "placeholder"
    razorpay_key_id          = "placeholder"
    razorpay_key_secret      = "placeholder"
    razorpay_webhook_secret  = "placeholder"
    sentry_dsn               = "placeholder"
    posthog_api_key          = "placeholder"
  })
}

# Outputs
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "load_balancer_dns" {
  value = aws_lb.main.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}
