const path = require('path');

const extraInclude = [
  path.resolve(__dirname, 'User Side', 'pages'),
  path.resolve(__dirname, 'User Side', 'styles'),
  path.resolve(__dirname, 'Admin Side', 'pages'),
  path.resolve(__dirname, 'Admin Side', 'components'),
];

module.exports = function override(config) {
  if (config?.resolve?.plugins) {
    config.resolve.plugins = config.resolve.plugins.filter(
      (plugin) => plugin.constructor.name !== 'ModuleScopePlugin',
    );
  }

  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    '@components': path.resolve(__dirname, 'src', 'components'),
    '@userPages': path.resolve(__dirname, 'User Side', 'pages'),
    '@userStyles': path.resolve(__dirname, 'User Side', 'styles'),
    '@adminPages': path.resolve(__dirname, 'Admin Side', 'pages'),
    '@adminComponents': path.resolve(__dirname, 'Admin Side', 'components'),
    '@adminStyles': path.resolve(__dirname, 'Admin Side', 'styles'),
  };

  const oneOfRule = config.module.rules.find((rule) => Array.isArray(rule.oneOf));
  if (oneOfRule) {
    oneOfRule.oneOf.forEach((rule) => {
      if (rule.loader && rule.loader.includes('babel-loader')) {
        if (Array.isArray(rule.include)) {
          rule.include.push(...extraInclude);
        } else if (rule.include) {
          rule.include = [rule.include, ...extraInclude];
        } else {
          rule.include = extraInclude;
        }
      }
    });
  }

  return config;
};
