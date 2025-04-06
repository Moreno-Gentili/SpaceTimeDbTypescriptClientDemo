import './index.css';
import { DbConnection, EntityKind, EntityState, ErrorContext, EventContext, Movable, Vector3 } from './module_bindings';
import { Identity } from '@clockworklabs/spacetimedb-sdk';

type Position = Vector3;
type Velocity = Vector3;
type EntityEvent = 'Inserted' | 'Updated' | 'Deleted';
type QueueItem = { event: EntityEvent, id: string, position: Position, kind: EntityKind, state: EntityState };
const queue: Array<QueueItem> = [];

const onConnect = (
    conn: DbConnection,
    identity: Identity,
    token: string
  ) => {
    localStorage.setItem('auth_token', token);
    console.log(
      'Connected to SpacetimeDB with identity:',
      identity.toHexString()
    );

    subscribeToQueries(conn, ['SELECT * FROM movables']);
  };

  const onDisconnect = () => {
    console.log('Disconnected from SpacetimeDB');
  };

  const onConnectError = (_conn: ErrorContext, err: Error) => {
    console.log('Error connecting to SpacetimeDB:', err);
  };

  const subscribeToQueries = (conn: DbConnection, queries: string[]) => {
    let count = 0;
    for (const query of queries) {
      conn
        ?.subscriptionBuilder()
        .onApplied(() => {
          count++;
          if (count === queries.length) {
            console.log('SDK client cache initialized.');
            conn.db.movables.onInsert((_, row) => enqueue('Inserted', row));
            conn.db.movables.onUpdate((_, row) => enqueue('Updated', row));
            conn.db.movables.onDelete((_, row) => enqueue('Deleted', row));
            for (const movable of conn.db.movables.iter())
            {
              enqueue('Updated', movable);
            }
          }
        })
        .subscribe(query);
    }
  };

  const enqueue = (event: EntityEvent, movable: Movable) => {
    queue.push({
      event,
      id: movable.name,
      kind: movable.kind,
      state: movable.state,
      position: movable.position
    });

    window.requestAnimationFrame(render);
  };

  const render = () => {
    while (queue.length > 0) {
      const queueItem = queue.shift();
      if (!queueItem) continue;
      switch (queueItem.event) {
        case 'Inserted':
        case 'Updated':
          const movable = ensureMovableExists(queueItem);
          updateMovable(movable, queueItem.position, queueItem.state);
          break;
        case 'Deleted':
          document.getElementById(queueItem.id)?.remove();
          break;
        default:
          throw new Error(`Event type ${queueItem.event} not supported`);
      }
    }
  };

  const ensureMovableExists = (queueItem: QueueItem): HTMLElement => {
    let movable = document.getElementById(queueItem.id);
    if (!movable) {
      const field = document.getElementById('field');
      if (!field) throw new Error('Could not find field');

      movable = document.createElement('div');
      movable.id = queueItem.id;
      movable.classList.add(...getClassNamesForEntityKind(queueItem.kind));
      field.appendChild(movable);
    }

    return movable;
  };

  const getClassNamesForEntityKind = (entityKind: EntityKind) => {
    switch (entityKind.tag) {
      case EntityKind.Ball.tag:
        return ['movable', 'ball'];
      case EntityKind.SpacePlayer.tag:
        return ['movable', 'space', 'player'];
      case EntityKind.TimePlayer.tag:
        return ['movable', 'time', 'player'];
      default:
        throw new Error(`EntityKind ${entityKind.tag} not supported`);
    }
  }
  
  const updateMovable = (movable: HTMLElement, position: Position, state: EntityState) => {
    movable.dataset.x = position.x.toString();
    movable.dataset.y = position.y.toString();
    movable.dataset.z = position.z.toString();
    movable.dataset.state = state.tag.toLowerCase();
  }

  DbConnection.builder()
  .withUri('ws://15.160.238.28:3000')
  .withModuleName('space-vs-time')
  .withToken(localStorage.getItem('auth_token') || '')
  .onConnect(onConnect)
  .onDisconnect(onDisconnect)
  .onConnectError(onConnectError)
  .build();