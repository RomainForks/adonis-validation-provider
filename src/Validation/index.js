'use strict'

/*
 * adonis-validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const indicative = require('indicative')

/**
 * Validation class to validate data with a rules
 * schema.
 *
 * @class Validation
 * @constructor
 */
class Validation {
  constructor (data, rules, messages) {
    this._data = data
    this._rules = rules
    this._messages = messages
    this._errorMessages = null
    this._executed = false
  }

  /**
   * Sets the error as a property on instance, if they
   * are validation errors. Otherwise an exception
   * is thrown
   *
   * @method _useErrors
   *
   * @param  {Array}   errors
   *
   * @return {void}
   */
  _useErrors (errors) {
    if (errors instanceof Array === true) {
      this._errorMessages = errors
      return
    }
    throw errors
  }

  /**
   * Marks the validation as executed, also makes sure
   * that not re-executing the validations
   *
   * @method _markAsExecuted
   *
   * @return {void}
   */
  _markAsExecuted () {
    /**
     * Throw exception when re-running the validation for
     * multiple times
     */
    if (this._executed) {
      throw new Error('Cannot re-run validations on same data and rules')
    }
    this._executed = true
  }

  /**
   * Run validation on data using defined rules
   *
   * @method run
   *
   * @return {this}
   */
  async run () {
    try {
      this._markAsExecuted()
      await indicative.validate(this._data, this._rules, this._messages)
    } catch (error) {
      this._useErrors(error)
    }
    return this
  }

  /**
   * Run all validations, regardless of failures. The `run`
   * method on the opposite side stops at the first
   * validation
   *
   * @method runAll
   *
   * @return {this}
   */
  async runAll () {
    try {
      this._markAsExecuted()
      await indicative.validateAll(this._data, this._rules, this._messages)
    } catch (error) {
      this._useErrors(error)
    }
    return this
  }

  /**
   * Returns an array of validation messages
   * or null, if there are no errors
   *
   * @method messages
   *
   * @return {Array|Null}
   */
  messages () {
    return this._errorMessages
  }

  /**
   * Returns a boolean indicating if there are
   * validation errors
   *
   * @method fails
   *
   * @return {Boolean}
   */
  fails () {
    return !!this.messages()
  }
}

module.exports = Validation
