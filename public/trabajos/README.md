# Previews de trabajos

Acá van las piezas (fotos, capturas, mockups) que se muestran en el portfolio.
Las imágenes se sirven desde el propio sitio: no hace falta ningún servicio externo.

## Cómo se guardan

```
public/trabajos/<caso>/<caso>-01.jpg
public/trabajos/<caso>/<caso>-02.jpg
```

Ejemplo: `public/trabajos/oliver-sur/oliver-sur-01.jpg`.

## Medidas recomendadas

- Formato: JPEG o WebP, menos de ~300 KB por pieza.
- Preview del listado: 16:9 (por ejemplo 1600 × 900). En desktop se recorta a 21:9.
- Piezas de la ficha: 4:3 (por ejemplo 1400 × 1050).
- El recorte es `object-fit: cover`: lo importante tiene que estar en el centro.

## Cómo se conectan

En `src/app/page.tsx`, dentro del caso:

```ts
previews: [
  { src: "/trabajos/oliver-sur/oliver-sur-01.jpg", alt: "Descripción real de la pieza" },
  { src: "/trabajos/oliver-sur/oliver-sur-02.jpg", alt: "Otra pieza" },
],
```

- La **primera** se usa como preview en el listado de trabajos.
- **Todas** aparecen en la ficha del caso.
- Si el caso no tiene `previews`, no se muestra nada: el diseño queda igual que hoy.
- El `alt` describe lo que se ve, no "imagen del proyecto".
