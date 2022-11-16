"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const initial_js_1 = require("../initial.js");
console.log(
  chalk_1.default.white(initial_js_1.timestamp),
  chalk_1.default.underline.magentaBright("Startup"),
  ` ${initial_js_1.client.user?.username} files found, starting bot...`
);
