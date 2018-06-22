export const randomChar = () =>
  (Math.floor(Math.random() * 8) + 5).toString(16).toUpperCase();

export const randomHex = () =>
  `#${randomChar()}${randomChar()}${randomChar()}${randomChar()}${randomChar()}${randomChar()}`;

export const createGridMap = (rows, columns, content = 0) =>
  Array.from({
      length: rows
    }, () =>
    Array.from({
      length: columns
    }, () => content)
  );

export const detectCSSFeatureSupport = feature =>
  document.createElement('p').style[feature] === '';

export const supportsGrid = () => detectCSSFeatureSupport('gridColumn') || detectCSSFeatureSupport('msGridColumn');

export const mapItemCSSPropertiesToGridMap = (
    gridMap,
    colStart,
    colEnd,
    rowStart,
    rowEnd
  ) =>
  gridMap.map((row, rowIndex) =>
    row.map((columnValue, columnIndex) => {
      if (
        rowIndex >= rowStart - 1 &&
        rowIndex <= rowEnd - 2 &&
        columnIndex >= colStart - 1 &&
        columnIndex <= colEnd - 2
      ) {
        return columnValue + 1;
      }
      return columnValue;
    })
  );

export const mapItemCSSPropertiesToTableHierarchy = (
    gridMap,
    colStart,
    colEnd,
    rowStart,
    rowEnd,
    itemIndex
  ) =>
  gridMap.map((row, rowIndex) =>
    row.map((columnValue, columnIndex) => {
      if (
        rowIndex >= rowStart - 1 &&
        rowIndex <= rowEnd - 2 &&
        columnIndex >= colStart - 1 &&
        columnIndex <= colEnd - 2
      ) {
        return itemIndex;
      }
      return columnValue;
    })
  );

export const checkForCollisions = (gridItems, rows, columns) => {
  let gridMap = createGridMap(rows, columns);
  gridItems.forEach(gridItem => {
    gridMap = mapItemCSSPropertiesToGridMap(
      gridMap,
      gridItem.colStart,
      gridItem.colEnd,
      gridItem.rowStart,
      gridItem.rowEnd
    );
  });
  gridMap = [].concat(...gridMap);
  const collisions = gridMap.filter(cell => cell > 1);
  console.log(gridMap, collisions, collisions.length > 0);
  return collisions.length > 0;
};

export const createTableHierarchy = (gridItems, rows, columns) => {
  let gridMap = createGridMap(rows, columns, ' ');
  gridItems.forEach((gridItem, itemIndex) => {
    gridMap = mapItemCSSPropertiesToTableHierarchy(
      gridMap,
      gridItem.colStart,
      gridItem.colEnd,
      gridItem.rowStart,
      gridItem.rowEnd,
      itemIndex
    );
  });
  console.log('Table Hierarchy');
  console.log(gridMap);
};
