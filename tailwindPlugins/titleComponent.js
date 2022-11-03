/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

function camelToSnake(camel) {
  return camel.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

function getTitleConfig(rawConf, prefix) {
  const titleConfig =
    typeof rawConf === 'object' && rawConf != null && !Array.isArray(rawConf)
      ? Object.fromEntries(
          Object.entries(rawConf).filter(([key]) => key !== 'DEFAULT'),
        )
      : {};

  let variableMap = {};
  if (
    typeof rawConf === 'object' &&
    rawConf != null &&
    !Array.isArray(rawConf) &&
    rawConf.DEFAULT != null
  ) {
    Object.keys(rawConf.DEFAULT).forEach((subKey) => {
      const variable = `${prefix}-${camelToSnake(subKey)}`;
      if (!(subKey in variableMap)) {
        if (rawConf.DEFAULT != null && rawConf.DEFAULT[subKey] != null) {
          variableMap[subKey] = `var(${variable},${rawConf.DEFAULT[subKey]})`;
        } else {
          variableMap[subKey] = `var(${variable})`;
        }
      }
    });
  }

  return {
    config: Object.fromEntries(
      Object.entries(titleConfig).map(([key, value]) => {
        return [
          key,
          Object.fromEntries(
            Object.entries(value).map(([subKey, val]) => {
              const variable = `${prefix}-${camelToSnake(subKey)}`;
              return [variable, val];
            }),
          ),
        ];
      }),
    ),
    variableMap,
  };
}

function getTitleConfigs(
  rawMainConf,
  rawSubConf,
  variableMap = { main: {}, sub: {} },
) {
  const { config: subConf, variableMap: subVariableMap } = getTitleConfig(
    rawSubConf,
    `--title-sub`,
  );
  variableMap.sub = { ...variableMap.sub, ...subVariableMap };

  const { config: mainConf, variableMap: mainVariableMap } = getTitleConfig(
    rawMainConf,
    `--title-main`,
  );
  variableMap.main = { ...variableMap.main, ...mainVariableMap };

  const mergedConfs = Object.fromEntries(
    [...Object.keys(subConf), ...Object.keys(mainConf)].map((key) => {
      return [key, { ...(mainConf[key] ?? null), ...(subConf[key] ?? null) }];
    }),
  );

  return {
    mainConf,
    subConf,
    mergedConfs,
    variableMap,
  };
}

module.exports = plugin(
  function titleHelper({ matchUtilities, addUtilities, theme }) {
    const variableMap = { main: {}, sub: {} };
    const {
      mainConf: mainFontConf,
      subConf: subFontConf,
      mergedConfs: mergedFontConfs,
    } = getTitleConfigs(
      theme('title.main.font'),
      theme('title.sub.font'),
      variableMap,
    );
    const {
      mainConf: maincolorConf,
      subConf: subColorConf,
      mergedConfs: mergedColorConfs,
    } = getTitleConfigs(
      theme('title.main.color'),
      theme('title.sub.color'),
      variableMap,
    );
    matchUtilities(
      {
        title: (value) => value,
      },
      {
        values: mergedFontConfs,
      },
    );
    matchUtilities(
      {
        title: (value) => value,
      },
      {
        values: mergedColorConfs,
      },
    );
    matchUtilities(
      {
        'title-sub': (value) => value,
      },
      {
        values: subFontConf,
      },
    );
    matchUtilities(
      {
        'title-main': (value) => value,
      },
      {
        values: mainFontConf,
      },
    );
    matchUtilities(
      {
        'title-sub': (value) => value,
      },
      {
        values: subColorConf,
      },
    );
    matchUtilities(
      {
        'title-main': (value) => value,
      },
      {
        values: maincolorConf,
      },
    );
    addUtilities({
      '.title-main': {
        ...variableMap.main,
      },
      '.title-sub': {
        ...variableMap.sub,
      },
    });
  },
  {
    theme: {
      title: ({ theme }) => ({
        main: {
          font: Object.fromEntries(
            [
              ...Object.entries(theme('fontSize')),
              ['DEFAULT', theme('fontSize')['5xl']],
            ].map(
              /**
               * @param {[string, FontSize | undefined]} entry
               */
              ([key, val]) => {
                /** @type {{fontSize?:string;lineHeight?:string;letterSpacing?:string;fontWeight?:string|number;}} */
                const config = {};
                if (Array.isArray(val)) {
                  if (typeof val[1] === 'string') {
                    config.lineHeight = val[1];
                  } else {
                    Object.assign(config, val[1]);
                  }
                  config.fontSize = val[0];
                } else {
                  config.fontSize = val;
                }
                return [key, config];
              },
            ),
          ),
          color: {
            DEFAULT: {
              color: theme('colors.gray.900'),
            },
          },
        },
        sub: {
          font: {
            DEFAULT: {
              fontFamily: theme('fontFamily.mono'),
              fontWeight: theme('fontWeight.light'),
            },
          },
          color: {
            DEFAULT: {
              color: theme('colors.gray.500'),
            },
          },
        },
      }),
    },
  },
);
