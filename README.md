# cloudformation-to-cdk
CLI tool to convert a CLoudFormation template to a CDK app.

There are lots of CloudFormation templates floating out around there and many people/teams want to use CDK to deploy and modify their cloud applications. This tool allows you to convert CloudFormation templates into CDK apps.

```bash
npm i -g cloudformation-to-cdk
```

```bash
cf2cdk --template=template.yaml --app --language=ts
```
