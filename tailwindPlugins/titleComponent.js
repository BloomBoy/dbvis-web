/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');

/**
 * @typedef {import('tailwindcss').Config} TailwindConfig
 * @typedef {NonNullable<TailwindConfig['theme']>['fontSize'] extends import('tailwindcss/types/config').ResolvableTo<infer T> ? NonNullable<T>[string] : never} FontSize
 */

function camelToSnake(camel) {
  return camel.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

function getTitleConfig(rawConf, prefix, variableMap = { DEFAULT: {} }) {
  const titleConfig =
    typeof rawConf === 'object' && rawConf != null && !Array.isArray(rawConf)
      ? Object.fromEntries(
          Object.entries(rawConf).filter(([key]) => key !== 'DEFAULT'),
        )
      : {};
  if (
    typeof rawConf === 'object' &&
    rawConf != null &&
    !Array.isArray(rawConf) &&
    rawConf.DEFAULT != null
  ) {
    let defaultConf;
    let defaultExtras;
    if (Array.isArray(rawConf.DEFAULT)) {
      [defaultConf, defaultExtras] = rawConf.DEFAULT;
    } else {
      defaultConf = rawConf.DEFAULT;
    }
    Object.keys(defaultConf).forEach((subKey) => {
      const variable = `${prefix}-${camelToSnake(subKey)}`;
      if (!(subKey in variableMap.DEFAULT)) {
        const value = defaultConf[subKey];
        if (value != null) {
          variableMap.DEFAULT[subKey] = `var(${variable}, ${value})`;
        } else {
          variableMap.DEFAULT[subKey] = `var(${variable})`;
        }
      }
    });
    if (defaultExtras != null) {
      Object.entries(defaultExtras).forEach(([variant, conf]) => {
        Object.keys(conf).forEach((subKey) => {
          const variable = `${prefix}-${camelToSnake(subKey)}`;
          if (!(variant in variableMap)) {
            variableMap[variant] = {};
          }
          if (!(subKey in variableMap[variant])) {
            const value = conf[subKey];
            if (value != null) {
              variableMap[variant][
                subKey
              ] = `var(${variable}_${variant},${value})`;
            } else if (variableMap.DEFAULT[subKey] != null) {
              variableMap[variant][
                subKey
              ] = `var(${variable}_${variant},${variableMap.DEFAULT[subKey]})`;
            } else {
              variableMap[variant][
                subKey
              ] = `var(${variable}_${variant},var(${variable}))`;
            }
          }
        });
      });
    }
  }

  return Object.fromEntries(
    Object.entries(titleConfig).map(([key, value]) => {
      let conf, extra;
      if (Array.isArray(value)) {
        [conf, extra] = value;
      } else {
        conf = value;
      }
      return [
        key,
        Object.fromEntries([
          ...Object.entries(conf).map(([subKey, val]) => {
            const variable = `${prefix}-${camelToSnake(subKey)}`;
            if (!(subKey in variableMap.DEFAULT)) {
              variableMap.DEFAULT[subKey] = `var(${variable})`;
            }
            return [variable, val];
          }),
          ...Object.entries(extra ?? {}).flatMap(([variant, extraConf]) => {
            if (!(variant in variableMap)) {
              variableMap[variant] = {};
            }
            return Object.entries(extraConf).map(([subKey, val]) => {
              const variable = `${prefix}-${camelToSnake(subKey)}`;
              if (!(subKey in variableMap[variant])) {
                if (variableMap.DEFAULT[subKey] != null) {
                  variableMap[variant][
                    subKey
                  ] = `var(${variable}_${variant},${variableMap.DEFAULT[subKey]})`;
                } else {
                  variableMap[variant][
                    subKey
                  ] = `var(${variable}_${variant},var(${variable}))`;
                }
              }
              return [`${variable}_${variant}`, val];
            });
          }),
        ]),
      ];
    }),
  );
}

function getTitleConfigs(
  rawMainConf,
  rawSubConf,
  variableMap = { main: { DEFAULT: {} }, sub: { DEFAULT: {} } },
) {
  const subConf = getTitleConfig(rawSubConf, `--title-sub`, variableMap.sub);

  const mainConf = getTitleConfig(
    rawMainConf,
    `--title-main`,
    variableMap.main,
  );

  return {
    mainConf,
    subConf,
    variableMap,
  };
}

/**
 * @param {FontSize | undefined | null} fontSize
 * @returns {{fontSize?:string;lineHeight?:string;letterSpacing?:string;fontWeight?:string|number;} | null}
 */
function convertFontSize(fontSize) {
  if (fontSize == null) return null;
  /** @type {{fontSize?:string;lineHeight?:string;letterSpacing?:string;fontWeight?:string|number;}} */
  const config = {};
  if (Array.isArray(fontSize)) {
    if (typeof fontSize[1] === 'string') {
      config.lineHeight = fontSize[1];
    } else {
      Object.assign(config, fontSize[1]);
    }
    config.fontSize = fontSize[0];
  } else {
    config.fontSize = fontSize;
  }
  return config;
}

module.exports = plugin(
  function titleHelper({ matchUtilities, addUtilities, e, theme }) {
    const variableMap = { main: { DEFAULT: {} }, sub: { DEFAULT: {} } };
    const { mainConf: mainFontConf, subConf: subFontConf } = getTitleConfigs(
      theme('title.main.font'),
      theme('title.sub.font'),
      variableMap,
    );
    const { mainConf: maincolorConf, subConf: subColorConf } = getTitleConfigs(
      theme('title.main.color'),
      theme('title.sub.color'),
      variableMap,
    );
    matchUtilities(
      {
        'title-sub': (value) => ({
          ...Object.fromEntries(
            Object.keys(variableMap.sub)
              .filter((key) => key !== 'DEFAULT')
              .flatMap((variant) => {
                return Object.entries(value).map(([key, val]) => [
                  `${key}_${variant}`,
                  val,
                ]);
              }),
          ),
          ...value,
        }),
      },
      {
        values: subFontConf,
      },
    );
    matchUtilities(
      {
        title: (value) => ({
          ...Object.fromEntries(
            Object.keys(variableMap.main)
              .filter((key) => key !== 'DEFAULT')
              .flatMap((variant) => {
                return Object.entries(value).map(([key, val]) => [
                  `${key}_${variant}`,
                  val,
                ]);
              }),
          ),
          ...value,
        }),
      },
      {
        values: mainFontConf,
      },
    );
    matchUtilities(
      {
        'title-sub': (value) => ({
          ...Object.fromEntries(
            Object.keys(variableMap.sub)
              .filter((key) => key !== 'DEFAULT')
              .flatMap((variant) => {
                return Object.entries(value).map(([key, val]) => [
                  `${key}_${variant}`,
                  val,
                ]);
              }),
          ),
          ...value,
        }),
      },
      {
        values: subColorConf,
      },
    );
    matchUtilities(
      {
        title: (value) => ({
          ...Object.fromEntries(
            Object.keys(variableMap.main)
              .filter((key) => key !== 'DEFAULT')
              .flatMap((variant) => {
                return Object.entries(value).map(([key, val]) => [
                  `${key}_${variant}`,
                  val,
                ]);
              }),
          ),
          ...value,
        }),
      },
      {
        values: maincolorConf,
      },
    );
    const screens = theme('screens');
    const variantKeys = ['DEFAULT', ...Object.keys(screens)];
    addUtilities(
      Object.fromEntries(
        Object.entries(variableMap).flatMap(([type, conf]) => {
          return variantKeys
            .map((variant) => {
              const subConf = conf[variant];
              if (subConf == null) return null;
              if (variant === 'DEFAULT') {
                return [`.${e(`title-${type}`)}`, subConf];
              } else if (variant in screens) {
                return [
                  `@media (min-width: ${screens[variant]})`,
                  {
                    [`.${e(`title-${type}`)}`]: subConf,
                  },
                ];
              }
            })
            .filter((entry) => entry != null);
        }),
      ),
    );
  },
  {
    theme: {
      title: ({ theme }) => ({
        main: {
          font: {
            ...Object.fromEntries(
              Object.entries(theme('fontSize')).map(
                /**
                 * @param {[string, FontSize | undefined]} entry
                 */
                ([key, val]) => {
                  return [key, convertFontSize(val)];
                },
              ),
            ),
            DEFAULT: [
              convertFontSize(theme('fontSize.5xl')),
              { md: convertFontSize(theme('fontSize.7xl')) },
            ],
          },
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
