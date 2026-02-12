# Dependencies and React Migration

## npm install log

```zsh
/Users/patric/.zshrc:123: command not found: ng
 patric@Magrathea  ~/Documents/Entwicklung/source/workspace-metropolcon/conclar   develop ±  npm install
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @react-spring/three@9.5.2
npm warn Found: react@16.8.6
npm warn node_modules/react-spring/node_modules/react
npm warn   peer react@"^16.8.0  || >=17.0.0 || >=18.0.0" from @react-spring/konva@9.5.2
npm warn   node_modules/react-spring/node_modules/@react-spring/konva
npm warn     @react-spring/konva@"~9.5.2" from react-spring@9.5.2
npm warn     node_modules/react-spring
npm warn   4 more (@react-spring/native, react-dom, react-konva, react-reconciler)
npm warn
npm warn Could not resolve dependency:
npm warn peer react@"^16.11.0  || >=17.0.0 || >=18.0.0" from @react-spring/three@9.5.2
npm warn node_modules/react-spring/node_modules/@react-spring/three
npm warn   @react-spring/three@"~9.5.2" from react-spring@9.5.2
npm warn   node_modules/react-spring
npm warn
npm warn Conflicting peer dependency: react@19.2.4
npm warn node_modules/react
npm warn   peer react@"^16.11.0  || >=17.0.0 || >=18.0.0" from @react-spring/three@9.5.2
npm warn   node_modules/react-spring/node_modules/@react-spring/three
npm warn     @react-spring/three@"~9.5.2" from react-spring@9.5.2
npm warn     node_modules/react-spring
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @react-three/fiber@8.6.0
npm warn Found: react@16.8.6
npm warn node_modules/react-spring/node_modules/react
npm warn   peer react@"^16.8.0  || >=17.0.0 || >=18.0.0" from @react-spring/konva@9.5.2
npm warn   node_modules/react-spring/node_modules/@react-spring/konva
npm warn     @react-spring/konva@"~9.5.2" from react-spring@9.5.2
npm warn     node_modules/react-spring
npm warn   4 more (@react-spring/native, react-dom, react-konva, react-reconciler)
npm warn
npm warn Could not resolve dependency:
npm warn peer react@">=18.0" from @react-three/fiber@8.6.0
npm warn node_modules/react-spring/node_modules/@react-three/fiber
npm warn   peer @react-three/fiber@">=6.0" from @react-spring/three@9.5.2
npm warn   node_modules/react-spring/node_modules/@react-spring/three
npm warn
npm warn Conflicting peer dependency: react@19.2.4
npm warn node_modules/react
npm warn   peer react@">=18.0" from @react-three/fiber@8.6.0
npm warn   node_modules/react-spring/node_modules/@react-three/fiber
npm warn     peer @react-three/fiber@">=6.0" from @react-spring/three@9.5.2
npm warn     node_modules/react-spring/node_modules/@react-spring/three
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @react-three/fiber@8.6.0
npm warn Found: react-dom@16.8.6
npm warn node_modules/react-spring/node_modules/react-dom
npm warn   peer react-dom@"16.8.x" from react-konva@16.8.6
npm warn   node_modules/react-spring/node_modules/react-konva
npm warn     peer react-konva@"^16.8.0  || ^17.0.0" from @react-spring/konva@9.5.2
npm warn     node_modules/react-spring/node_modules/@react-spring/konva
npm warn
npm warn Could not resolve dependency:
npm warn peerOptional react-dom@">=18.0" from @react-three/fiber@8.6.0
npm warn node_modules/react-spring/node_modules/@react-three/fiber
npm warn   peer @react-three/fiber@">=6.0" from @react-spring/three@9.5.2
npm warn   node_modules/react-spring/node_modules/@react-spring/three
npm warn
npm warn Conflicting peer dependency: react-dom@19.2.4
npm warn node_modules/react-dom
npm warn   peerOptional react-dom@">=18.0" from @react-three/fiber@8.6.0
npm warn   node_modules/react-spring/node_modules/@react-three/fiber
npm warn     peer @react-three/fiber@">=6.0" from @react-spring/three@9.5.2
npm warn     node_modules/react-spring/node_modules/@react-spring/three
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: react-native@0.69.5
npm warn Found: react@16.8.6
npm warn node_modules/react-spring/node_modules/react
npm warn   peer react@"^16.8.0  || >=17.0.0 || >=18.0.0" from @react-spring/konva@9.5.2
npm warn   node_modules/react-spring/node_modules/@react-spring/konva
npm warn     @react-spring/konva@"~9.5.2" from react-spring@9.5.2
npm warn     node_modules/react-spring
npm warn   4 more (@react-spring/native, react-dom, react-konva, react-reconciler)
npm warn
npm warn Could not resolve dependency:
npm warn peer react@"18.0.0" from react-native@0.69.5
npm warn node_modules/react-spring/node_modules/react-native
npm warn   peer react-native@"*" from @react-native-community/cli@8.0.7
npm warn   node_modules/react-spring/node_modules/@react-native-community/cli
npm warn   2 more (@react-spring/native, @react-three/fiber)
npm warn
npm warn Conflicting peer dependency: react@18.0.0
npm warn node_modules/react
npm warn   peer react@"18.0.0" from react-native@0.69.5
npm warn   node_modules/react-spring/node_modules/react-native
npm warn     peer react-native@"*" from @react-native-community/cli@8.0.7
npm warn     node_modules/react-spring/node_modules/@react-native-community/cli
npm warn     2 more (@react-spring/native, @react-three/fiber)
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: react-reconciler@0.20.4
npm warn Found: react@17.0.2
npm warn node_modules/react
npm warn   react@"^17.0.2" from the root project
npm warn   24 more (@emotion/react, @react-spring/animated, ...)
npm warn
npm warn Could not resolve dependency:
npm warn peer react@"^16.0.0" from react-reconciler@0.20.4
npm warn node_modules/react-zdog/node_modules/react-reconciler
npm warn   react-reconciler@"^0.20.4" from react-zdog@1.0.11
npm warn   node_modules/react-zdog
npm warn
npm warn Conflicting peer dependency: react@16.14.0
npm warn node_modules/react
npm warn   peer react@"^16.0.0" from react-reconciler@0.20.4
npm warn   node_modules/react-zdog/node_modules/react-reconciler
npm warn     react-reconciler@"^0.20.4" from react-zdog@1.0.11
npm warn     node_modules/react-zdog
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: react-reconciler@0.27.0
npm warn Found: react@16.8.6
npm warn node_modules/react-spring/node_modules/react
npm warn   peer react@"^16.8.0  || >=17.0.0 || >=18.0.0" from @react-spring/konva@9.5.2
npm warn   node_modules/react-spring/node_modules/@react-spring/konva
npm warn     @react-spring/konva@"~9.5.2" from react-spring@9.5.2
npm warn     node_modules/react-spring
npm warn   4 more (@react-spring/native, react-dom, react-konva, react-reconciler)
npm warn
npm warn Could not resolve dependency:
npm warn peer react@"^18.0.0" from react-reconciler@0.27.0
npm warn node_modules/react-spring/node_modules/@react-three/fiber/node_modules/react-reconciler
npm warn   react-reconciler@"^0.27.0" from @react-three/fiber@8.6.0
npm warn   node_modules/react-spring/node_modules/@react-three/fiber
npm warn
npm warn Conflicting peer dependency: react@18.3.1
npm warn node_modules/react
npm warn   peer react@"^18.0.0" from react-reconciler@0.27.0
npm warn   node_modules/react-spring/node_modules/@react-three/fiber/node_modules/react-reconciler
npm warn     react-reconciler@"^0.27.0" from @react-three/fiber@8.6.0
npm warn     node_modules/react-spring/node_modules/@react-three/fiber
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: suspend-react@0.0.8
npm warn Found: react@16.8.6
npm warn node_modules/react-spring/node_modules/react
npm warn   peer react@"^16.8.0  || >=17.0.0 || >=18.0.0" from @react-spring/konva@9.5.2
npm warn   node_modules/react-spring/node_modules/@react-spring/konva
npm warn     @react-spring/konva@"~9.5.2" from react-spring@9.5.2
npm warn     node_modules/react-spring
npm warn   4 more (@react-spring/native, react-dom, react-konva, react-reconciler)
npm warn
npm warn Could not resolve dependency:
npm warn peer react@">=17.0" from suspend-react@0.0.8
npm warn node_modules/react-spring/node_modules/@react-three/fiber/node_modules/suspend-react
npm warn   suspend-react@"^0.0.8" from @react-three/fiber@8.6.0
npm warn   node_modules/react-spring/node_modules/@react-three/fiber
npm warn
npm warn Conflicting peer dependency: react@19.2.4
npm warn node_modules/react
npm warn   peer react@">=17.0" from suspend-react@0.0.8
npm warn   node_modules/react-spring/node_modules/@react-three/fiber/node_modules/suspend-react
npm warn     suspend-react@"^0.0.8" from @react-three/fiber@8.6.0
npm warn     node_modules/react-spring/node_modules/@react-three/fiber
npm warn deprecated stable@0.1.8: Modern JS already guarantees Array#sort() is a stable sort, so this library is deprecated. See the compatibility table on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#browser_compatibility
npm warn deprecated source-map-url@0.4.1: See https://github.com/lydell/source-map-url#deprecated
npm warn deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
npm warn deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
npm warn deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
npm warn deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm warn deprecated source-map-resolve@0.5.3: See https://github.com/lydell/source-map-resolve#deprecated
npm warn deprecated rimraf@2.2.8: Rimraf versions prior to v4 are no longer supported
npm warn deprecated metro-react-native-babel-preset@0.70.4: Use @react-native/babel-preset instead
npm warn deprecated metro-react-native-babel-preset@0.70.4: Use @react-native/babel-preset instead
npm warn deprecated uglify-es@3.3.10: support for ECMAScript is superseded by `uglify-js` as of v3.13.0
npm warn deprecated svgo@1.3.2: This SVGO version is no longer supported. Upgrade to v2.x.x.

added 2020 packages, and audited 2021 packages in 8s

303 packages are looking for funding
  run `npm fund` for details

19 vulnerabilities (6 moderate, 13 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
 patric@Magrathea  ~/Documents/Entwicklung/source/workspace-metropolcon/conclar   develop ±  
```

