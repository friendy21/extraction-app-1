import { connectionService } from '../app/lib/services/connectionService';

const defaultKeys = ['microsoft365','googleWorkspace','dropbox','slack','zoom','jira'];

describe('connectionService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default platforms when no order saved', async () => {
    const platforms = await connectionService.getPlatforms();
    expect(platforms).toHaveLength(defaultKeys.length);
  });

  it('saves and returns custom platform order', async () => {
    const order = ['jira','slack','zoom'];
    await connectionService.savePlatformOrder(order);
    const platforms = await connectionService.getPlatforms();
    expect(platforms.map(p => p.connectionKey)).toEqual(order);
  });
});
