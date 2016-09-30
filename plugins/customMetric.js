(function(w) {
	w.BOOMR = w.BOOMR || {};
	w.BOOMR.plugins = w.BOOMR.plugins || {};

	var impl = {
		patterns: {
			callback: function(rule) {
				if (typeof rule.value !== "function") {
					w.BOOMR.warn("Custom Metric Plugin Error: Unspecified rule callback '" + rule.value + "'");
					return null;
				}

				return rule.value();
			}
		}
	};

	function parseRule(rule, store) {
		if (!impl.patterns[rule.pattern]) {
			w.BOOMR.warn("Custom Metric Plugin Error: Unmatched rule pattern '" + rule.pattern + "'");
			return;
		}

		if (!rule.property) {
			w.BOOMR.warn("Custom Metric Plugin Error: Unspecified rule property '" + rule.property + "'");
			return;
		}

		try {
			var result = impl.patterns[rule.pattern](rule);

			// Check for undefined, null and NaN
			if (result != null && result === result) {
				store[rule.property] = result;
			}
		}
		catch (e) {
			w.BOOMR.debug("Custom Metric Plugin Error: '" + e.message + "'");
		}
	}

	function parseRules(o) {
		if (impl.rules && impl.rules.length) {
			for (var i = 0; i < impl.rules.length; i++) {
				parseRule(impl.rules[i], o);
			}
		}
	}

	w.BOOMR.plugins.CustomMetric = {
		is_complete: function() {
			return true;
		},
		is_supported: function() {
			return true;
		},
		init: function(config) {
			config = config || {};

			w.BOOMR.utils.pluginConfig(impl, config, "CustomMetric", ["rules"]);
			w.BOOMR.subscribe("before_beacon", parseRules);

			return this;
		},

		// Exposed for testing purposes
		parseRules: parseRules
	};

}(window));


