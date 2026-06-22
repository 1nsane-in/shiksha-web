terraform {
  backend "s3" {
    bucket = "medical-platform-tfstate-staging"
    key    = "staging/terraform.tfstate"
    region = "ap-southeast-1"
  }
}

module "infrastructure" {
  source = "../../"

  environment     = "staging"
  region          = "ap-southeast-1"
  instance_count  = 1
}
