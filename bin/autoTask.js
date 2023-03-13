#!/usr/bin/env node

import run from '../lib/index.js'
import { resovePath } from '../lib/utils/index.js'

const avgs = process.argv
const packagePath = resovePath('package.json')

const userAvgs = avgs.slice(2)

run(userAvgs, packagePath)
