# VR Icon

### Como usar o componente `VrcIcon` :

Para usar o ´vr icon´ precisa primeiro importar o seu modulo de preferencia no componente, e então usar seu componente no template.
 - lista de icones [DesingGuide](https://vrsoftbr.github.io/VRDesignGuide/icones)

 -----
- Propriedade ```name```

```typescript
<vrc-icon name="comprador"></vrc-icon>
```
 -----
- Propriedade ```toggle```

```typescript
<vrc-icon name="ver" toggle="ver_desabilitado"></vrc-icon>
```
----
- Propriedade ```width e height```

```typescript
<vrc-icon
  name="comprador"
  width="20"
  height="20"
></vrc-icon>
```
----
- Propriedade ```rotate```

```typescript
<vrc-icon
  name="comprador"
  width="20"
  height="20"
  rotate="180"
></vrc-icon>
```
----
- Propriedade ```filter```

```typescript
<vrc-icon
  name="comprador"
  width="20"
  height="20"
  filter="invert(15%) sepia(91%) saturate(5322%) hue-rotate(359deg) brightness(107%) contrast(124%)"
></vrc-icon>
```
----

- Propriedade ```cssClass```

```typescript
  <vrc-icon
    width="20"
    height="20"
    cssClass="my-icon-svg"
  ></vrc-icon>
```
----

- Propriedade ```url```

```typescript
  <vrc-icon
    width="20"
    height="20"
    cssClass="my-icon-svg-url"
    url="./../../../../assets/icons/linux.svg"
  ></vrc-icon>
```
----
## Propriedades

|                |                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ```name```     | define o nome do icone com base no DesignGuide                                                                                                                     |
| ```toogle```   | define o nome segundario de icone com base no DesignGuide, quando  é passado valor toogle o componente alterna entre icone passado pelo name e toogle a cada click |
| ```width```    | define a largura e background-size                                                                                                                                 |
| ```height```   | define a altura e background-size                                                                                                                                  |
| ```rotate```   | aplica o rotate do css                                                                                                                                             |
| ```filter```   | aplica o filter no svg do css                                                                                                                                      |
| ```cssClass``` | define uma classe para personalizar o icone                                                                                                                        |
| ```url```      | define o caminho para um icone personalizado                                                                                                                       |

----
