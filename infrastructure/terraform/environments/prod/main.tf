terraform {
  backend "s3" {
    bucket = "medical-platform-tfstate-prod"
    key    = "prod/terraform.tfstate"
    region = "ap-southeast-1"
  }
}

module "infrastructure" {
  source = "../../"

  environment     = "prod"
  region          = "ap-southeast-1"
  instance_count  = 3
}
