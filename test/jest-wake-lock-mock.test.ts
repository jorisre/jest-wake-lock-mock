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
