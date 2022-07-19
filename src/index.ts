#!/usr/bin/env node

import { program } from "commander";
import { version, description } from "../package.json";

program.name("cf2cdk").description(description).version(version);

program.parse();
console.log(process.env);
