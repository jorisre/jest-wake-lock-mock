import { mocked } from 'ts-jest/utils';

const requestWakeLock = async (onRelease: EventListener) => {
  try {
    const wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', onRelease);

    return { wakeLock };
  } catch (error) {
    return { error };
  }
};

test('wakeLock handles request then release with success', async () => {
  const handleRelease = jest.fn();
  const { wakeLock, error } = await requestWakeLock(handleRelease);

  expect(error).not.toBeDefined();
  expect(wakeLock).toBeDefined();
  expect(handleRelease).not.toHaveBeenCalled();

  if (wakeLock) {
    const onReleaseSpy = jest.spyOn(wakeLock, 'onrelease');

    expect(wakeLock?.type).toEqual('screen');
    expect(wakeLock?.released).toBe(false);

    // Handle wakeLock release
    wakeLock?.release();
    expect(wakeLock?.type).toEqual('screen');
    expect(wakeLock?.released).toBe(true);
    expect(handleRelease).toHaveBeenCalledWith(expect.any(Event));
    expect(onReleaseSpy).toHaveBeenCalledWith(expect.any(Event));

    wakeLock?.removeEventListener('release', handleRelease);
    expect(handleRelease).toHaveBeenLastCalledWith(expect.any(Event));
  }
});

test('wakeLock handles request and throw an error', async () => {
  const wakeLockError = new Error('wakeLock error');
  const handleRelease = jest.fn();
  mocked(navigator.wakeLock.request).mockRejectedValueOnce(wakeLockError);

  const { wakeLock, error } = await requestWakeLock(handleRelease);

  expect(wakeLock).not.toBeDefined();
  expect(error).toMatchInlineSnapshot(`[Error: wakeLock error]`);
  expect(handleRelease).not.toHaveBeenCalled();
});

test('wakeLock handles request then release multiple times', async () => {
  // First time
  const firstHandleRelease = jest.fn();
  const { wakeLock, error } = await requestWakeLock(firstHandleRelease);

  expect(error).not.toBeDefined();
  expect(wakeLock).toBeDefined();
  expect(firstHandleRelease).not.toHaveBeenCalled();

  if (wakeLock) {
    const onReleaseSpy = jest.spyOn(wakeLock, 'onrelease');

    expect(wakeLock?.type).toEqual('screen');
    expect(wakeLock?.released).toBe(false);

    // Handle wakeLock release
    wakeLock?.release();
    expect(wakeLock?.type).toEqual('screen');
    expect(wakeLock?.released).toBe(true);
    expect(firstHandleRelease).toHaveBeenCalledWith(expect.any(Event));
    expect(onReleaseSpy).toHaveBeenCalledWith(expect.any(Event));

    wakeLock?.removeEventListener('release', firstHandleRelease);
    expect(firstHandleRelease).toHaveBeenLastCalledWith(expect.any(Event));
  }

  // Nd time
  const ndHandleRelease = jest.fn();
  const { wakeLock: ndWakeLock, error: ndError } = await requestWakeLock(
    ndHandleRelease
  );

  expect(ndError).not.toBeDefined();
  expect(ndWakeLock).toBeDefined();
  expect(ndHandleRelease).not.toHaveBeenCalled();

  if (ndWakeLock) {
    const onReleaseSpy = jest.spyOn(ndWakeLock, 'onrelease');

    expect(ndWakeLock?.type).toEqual('screen');
    expect(ndWakeLock?.released).toBe(false);

    // Handle wakeLock release
    ndWakeLock?.release();
    expect(ndWakeLock?.type).toEqual('screen');
    expect(ndWakeLock?.released).toBe(true);
    expect(ndHandleRelease).toHaveBeenCalledWith(expect.any(Event));
    expect(onReleaseSpy).toHaveBeenCalledWith(expect.any(Event));

    ndWakeLock?.removeEventListener('release', ndHandleRelease);
    expect(ndHandleRelease).toHaveBeenLastCalledWith(expect.any(Event));
  }
});
