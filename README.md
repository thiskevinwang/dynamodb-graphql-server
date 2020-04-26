# graphql-server-example

## Getting Started

```bash
git clone https://github.com/thiskevinwang/graphql-server-example.git
cd graphql-server-example
yarn install
yarn run develop

# go to localhost:4000
```

---

## Education sources

- https://medium.com/@joranquinten/how-to-deploy-a-nodejs-server-on-zeits-now-platform-e713207313d3

### AWS-SDK

- https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateTable-property

### Local DynamoDB w/ Docker

- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.Docker.html
- https://hub.docker.com/r/amazon/dynamodb-local

```bash
docker pull amazon/dynamodb-local
docker run -p 8000:8000 amazon/dynamodb-local
```

### Dynamo Tutorial

Node:

- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.01.html

### DynamoDB Data Model

- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.html

### Cheatsheet

#### CLI Commands

##### Help

```bash
aws dynamodb help
```

##### List Tables

```bash
aws dynamodb list-tables help
aws dynamodb list-tables --endpoint-url http://localhost:8081
```

##### Scan

```bash
aws dynamodb scan help
aws dynamodb scan --table-name Snacks
```

##### Put Item

```bash
aws dynamodb put-item help
aws dynamodb put-item --table-name Snacks --item '{"Id": {"S": "1"}}'
```

##### Update Item

```bash
aws dynamodb update-item help

# Add / Overwrite Attribute
aws dynamodb update-item \
  --table-name Snacks \
  --key '{"Id": {"S": "1"}}' \
  --attribute-updates '{"MyNewAttributeName": {"Value": {"S":"Poteko"}}}'

# Actions --- [ADD, DELETE, PUT]

# Delete Attribute
# - "Value" (not required)
aws dynamodb update-item \
  --table-name Snacks \
  --key '{"Id": {"S": "1"}}' \
  --attribute-updates '{"MyNewAttributeName": {"Action": "DELETE" }}'

# Increment/Decrement a "N" Attribute
aws dynamodb update-item \
  --table-name Snacks \
  --key '{"Id": {"S": "1"}}' \
  --attribute-updates \
  '{"Count": {"Value": {"N":"0"}}}'

aws dynamodb update-item \
  --table-name Snacks \
  --key '{"Id": {"S": "1"}}' \
  --attribute-updates \
  '{ "Count": {"Action": "ADD",  "Value": {"N":"1"}}}'

aws dynamodb update-item \
  --table-name Snacks \
  --key '{"Id": {"S": "1"}}' \
  --attribute-updates \
  '{ "Count": {"Action": "ADD",  "Value": {"N":"-1"}}}'
```
