#!/usr/bin/env node

import { program } from "commander";
import { version, description } from "../package.json";
import { CollectionTag, parse, ScalarTag } from "yaml";

import { readFileSync } from "fs";
import { join } from "path";
import { inspect } from "util";
import { App, Stack } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";

const app = new App();
const stack = new Stack(app, "TestStack");

program.name("cf2cdk").description(description).version(version);

program.requiredOption("-t, --template <template>", "Template to use");

program.parse();
// console.log(program.opts().template);
const template = program.opts().template;

const supportedFunctions = [
  "Fn::Base64",
  "Fn::Cidr",
  "Fn::FindInMap",
  "Fn::GetAtt",
  "Fn::GetAZs",
  "Fn::ImportValue",
  "Fn::Join",
  "Fn::Select",
  "Fn::Split",
  "Fn::Sub",
  "Fn::Transform",
  "Ref",
  "Condition",
  "Fn::And",
  "Fn::Equals",
  "Fn::If",
  "Fn::Not",
  "Fn::Or",
];

const supportedTags = supportedFunctions.map((func) => {
  const name = func.replace(/^Fn::/, "");

  const tag: ScalarTag = {
    resolve(value, onError, options) {
      return {
        value,
        name,
      };
    },
    tag: `!${name}`,
    default: false,
  };

  const tag1: CollectionTag = {
    collection: "seq",
    resolve(value, onError, options) {
      // console.log(value);
      return {
        value,
        name,
      };
    },
    tag: `!${name}`,
    default: false,
  };

  const tag2: CollectionTag = {
    collection: "map",
    resolve(value, onError, options) {
      // console.log(value);
      return {
        value,
        name,
      };
    },
    tag: `!${name}`,
    default: false,
  };

  return [tag, tag1, tag2];
});

// console.log(supportedTags);

const yml = parse(readFileSync(join(process.cwd(), template)).toString(), {
  customTags: supportedTags.flat(),
});

interface Resource {
  Type: string;
  Properties: any;
}

for (const [resourceName, resource] of Object.entries<Resource>(
  yml.Resources
)) {
  const resourceType = resource.Type;

  const serviceProvider = resourceType.split("::")[0];
  let serviceName = resourceType.split("::")[1];
  const dataType = resourceType.split("::")[2];

  if (serviceProvider !== "AWS") continue;
  if (serviceName === "Serverless") continue;

  serviceName = serviceName.toLowerCase();

  console.log(resourceName, serviceName, dataType);

  `cdk.aws_${"s3"}.Bucket`;
  // console.log(inspect(resource, { depth: null }));
}

// console.log(
//   inspect(yml.Resources.CustomDomainCloudfrontDistribution, { depth: 8 })
// );
