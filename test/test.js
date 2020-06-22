const assert = require('assert');
const calculate = require('../commands/calculate');
describe('Calculate', function() {
	describe('#insufficientArgs(args)', function() {
		it('should return true when the amount of arguments is less than 3', function() {
			assert.equal(calculate.insufficientArgs(['1', '2']), true);
		});
		it('should return false when the amount of arguments is 3 or more', function() {
			assert.equal(calculate.insufficientArgs(['*', '2', '3']), false);
			assert.equal(calculate.insufficientArgs(['*', '2', '3', '4']), false);
		});
	});
	describe('#isOperator(firstArg)', function() {
		it('should return false when the first argument is not one of *, +, / or -', function() {
			assert.equal(calculate.isOperator(' '), false);
			assert.equal(calculate.isOperator('w'), false);
		});
		it('should return true when the first argument is *', function() {
			assert.equal(calculate.isOperator('*'), true);
		});
		it('should return true when the first argument is /', function() {
			assert.equal(calculate.isOperator('/'), true);
		});
		it('should return true when the first argument is -', function() {
			assert.equal(calculate.isOperator('+'), true);
		});
		it('should return true when the first argument is +', function() {
			assert.equal(calculate.isOperator('-'), true);
		});
	});
});
