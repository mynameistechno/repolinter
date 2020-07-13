// Copyright 2017 TODO Group. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line no-unused-vars
const Result = require('../lib/result')
// eslint-disable-next-line no-unused-vars
const FileSystem = require('../lib/file_system')

function getContent (options) {
  return options['human-readable-content'] !== undefined ? options['human-readable-content'] : options.content
}

/**
 * Check if a list of files contains a regular expression.
 *
 * @param {FileSystem} fs A filesystem object configured with filter paths and target directories
 * @param {object} options The rule configuration
 * @param {boolean} not Whether or not to invert the result (not contents instead of contents)
 * @returns {Result} The lint rule result
 */
function fileContents (fs, options, not = false) {
  const files = fs.findAllFiles(options.globsAll)

  if (files.length === 0) {
    const message = `not found: (${options.globsAll.join(', ')})`
    return new Result(message, [], !options['fail-on-non-existent'])
  }

  const results = files.map(file => {
    let fileContents = fs.getFileContents(file)
    if (fileContents === undefined) {
      fileContents = ''
    }
    const regexp = new RegExp(options.content, options.flags)

    const passed = fileContents.search(regexp) >= 0
    const message = `${passed ? 'Contains' : 'Doesn\'t contain'} ${getContent(options)}`

    return {
      passed: not ? !passed : passed,
      path: file,
      message
    }
  })

  const passed = !results.find(r => !r.passed)

  return new Result('', results, passed)
}

module.exports = fileContents
