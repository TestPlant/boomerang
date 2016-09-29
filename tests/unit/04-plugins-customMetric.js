/*eslint-env mocha*/
/*global chai*/

describe("BOOMR.plugins.CustomMetric", function() {
	var assert = chai.assert;

	describe("exports", function() {
		it("should have a CustomMetric object", function() {
			assert.isObject(BOOMR.plugins.CustomMetric);
		});

		it("should have a is_complete() function", function() {
			assert.isFunction(BOOMR.plugins.CustomMetric.is_complete);
		});

		it("should always be complete", function() {
			assert.isTrue(BOOMR.plugins.CustomMetric.is_complete());
		});

		it("should have a is_supported() function", function() {
			assert.isFunction(BOOMR.plugins.CustomMetric.is_supported);
		});

		it("should always be supported", function() {
			assert.isTrue(BOOMR.plugins.CustomMetric.is_supported());
		});

		it("should have an init() function", function() {
			assert.isFunction(BOOMR.plugins.CustomMetric.init);
		});

		it("should have a parseRules() function", function() {
			assert.isFunction(BOOMR.plugins.CustomMetric.parseRules);
		});
	});

	describe("parseRules", function() {
		it("should not modify the beacon given an empty ruleset", function() {
			var original = {
				existing: "value"
			};
			var expected = {
				existing: "value"
			};

			BOOMR.plugins.CustomMetric.init({
				CustomMetric: {
					rules: []
				}
			});
			BOOMR.plugins.CustomMetric.parseRules(original);

			assert.deepEqual(original, expected);
		});

		describe("callback pattern", function() {
			it("should modify the beacon given multiple valid callbacks", function() {
				var original = {
					existing: "value"
				};
				var expected = {
					existing: "value",
					"test.success-1": "test.value-1",
					"test.success-2": "test.value-2"
				};

				BOOMR.plugins.CustomMetric.init({
					CustomMetric: {
						rules: [{
							pattern: "callback",
							property: "test.success-1",
							value: function() {
								return "test.value-1";
							}
						}, {
							pattern: "callback",
							property: "test.success-2",
							value: function() {
								return "test.value-2";
							}
						}]
					}
				});
				BOOMR.plugins.CustomMetric.parseRules(original);

				assert.deepEqual(original, expected);
			});

			it("should modify the beacon given a malformed callback and a valid callback", function() {
				var original = {
					existing: "value"
				};
				var expected = {
					existing: "value",
					"test.success": "test.value"
				};

				BOOMR.plugins.CustomMetric.init({
					CustomMetric: {
						rules: [{
							pattern: "callback",
							property: "test.success",
							value: function() {
								return "test.value";
							}
						}, {
							pattern: "callback",
							property: "test.failure",
							value: "not-a-function"
						}]
					}
				});
				BOOMR.plugins.CustomMetric.parseRules(original);

				assert.deepEqual(original, expected);
			});

			it("should modify the beacon given an erroneous callback and a valid callback", function() {
				var original = {
					existing: "value"
				};
				var expected = {
					existing: "value",
					"test.success": "test.value"
				};

				BOOMR.plugins.CustomMetric.init({
					CustomMetric: {
						rules: [{
							pattern: "callback",
							property: "test.falure",
							value: function() {
								throw Error("testing");
							}
						}, {
							pattern: "callback",
							property: "test.success",
							value: function() {
								return "test.value";
							}
						}]
					}
				});
				BOOMR.plugins.CustomMetric.parseRules(original);

				assert.deepEqual(original, expected);
			});
		});
	});
});
