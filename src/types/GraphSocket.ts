type SocketShape = 'DIAMOND_DOT';

export type SocketType = 'VALUE' | 'GEOMETRY' | 'VECTOR' | 'INT' | 'BOOLEAN';

export type GraphSocket = {
  id: string;
  identifier: string;
  name: string;
  value: any;
  type: SocketType;
  display_shape: SocketShape;
  is_multi_input: boolean;
  shape: string;
};