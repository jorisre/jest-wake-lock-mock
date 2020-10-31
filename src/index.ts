import { WakeLockRequest } from './WakeLock';

Object.defineProperty(global.window.navigator, 'wakeLock', {
  value: {
    request: jest.fn((type: WakeLockType) => new WakeLockRequest(type)),
  },
});
