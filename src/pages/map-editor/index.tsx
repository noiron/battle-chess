/**
 * 地图编辑器
 */
import lodash from 'lodash';
import styled from 'styled-components';
import { COLS, ROWS } from '../battle';
import Cell from './cell';
import {
  TERRAIN_TEXT,
  CITY,
  GRASS,
  TREE,
  WATER,
  PLAIN,
  MOUNTAIN,
} from '@constants';

const Box = styled.div`
  width: 800px;
  height: 500px;
  background-color: #fff;
  display: flex;

  .editor {
    flex-basis: 70%;
    border-right: 1px solid #ccc;
    padding: 20px;
    position: relative;
    .map {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .row {
      display: flex;
    }
  }

  .panel {
    padding: 20px;
  }
`;

const MapEditor = () => {
  return (
    <Box>
      <div className="editor">
        <div className="map">
          {lodash.range(ROWS).map((_, y) => {
            return (
              <div key={y} className="row">
                {lodash.range(COLS).map((_, x) => {
                  return <Cell key={x}></Cell>;
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="panel">
        <div style={{ display: 'flex' }}>
          <Cell>{TERRAIN_TEXT[PLAIN]}</Cell>
          <Cell>{TERRAIN_TEXT[MOUNTAIN]}</Cell>
          <Cell>{TERRAIN_TEXT[GRASS]}</Cell>
          <Cell>{TERRAIN_TEXT[TREE]}</Cell>
          <Cell>{TERRAIN_TEXT[WATER]}</Cell>
          <Cell>{TERRAIN_TEXT[CITY]}</Cell>
        </div>
      </div>
    </Box>
  );
};

export default MapEditor;
