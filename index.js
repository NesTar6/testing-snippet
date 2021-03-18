import subject from '../client/reducers/marketsReducer';

/**
 * One of the main benefits of reducers is how testable they are. Since they're
 * pure (in theory), all we have to do is look at the inputs and outputs. We
 * can also add some tests to determine if the reducer really is pure!
 */
describe('MegaMarkets reducer', () => {
  let state;

  beforeEach(() => {
    state = {
      totalMarkets: 0,
      totalCards: 0,
      marketList: [],
      newLocation: '',
      synced: true,
    };
  });

  describe('default state', () => {
    it('should return a default state when given an undefined input', () => {
      expect(subject(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe('unrecognized action types', () => {
    it('should return the original without any duplication', () => {
      const action = { type: 'aajsbicawlbejckr' };
      expect(subject(state, action)).toBe(state);
    });
  });

  describe('ADD_MARKET', () => {
    const action = {
      type: 'ADD_MARKET',
      payload: 'Azkaban',
    };

    it('adds a market', () => {
      const { marketList } = subject(state, action);
      expect(marketList[0]).toEqual({
        location: 'Azkaban',
        cards: 0,
      });
    });

    it('increases total market count by 1', () => {
      const { totalMarkets: oldState } = state;
      const { totalMarkets } = subject(state, action);
      expect(totalMarkets).toEqual(oldState + 1);
    });

    // Remember that in Redux we never mutate. If something changes, we copy
    // the data structure! Hint: `.toBe` or `.not.toBe` are your questions.
    it('returns a state object not strictly equal to the original', () => {
      const newState = subject(state, action);
      expect(newState).not.toEqual(state);
    });

    it('includes a marketList not strictly equal to the original', () => {
      const { marketList: newMarketList } = subject(state, action);
      expect(state.marketList).not.toEqual(newMarketList);
    });

    it('clears the newLocation field', () => {
      const { newLocation } = subject(state, action);
      expect(newLocation).toEqual('');
    });
  });

  describe('UPDATE_LOCATION', () => {

    const action = {
      type: 'UPDATE_LOCATION',
      payload: 'Azkaban',
    };

    it('updates location with the action payload', () => {
      const { payload: actionPayload } = action;
      const { newLocation } = subject(state, action);
      expect(actionPayload).toEqual(newLocation);
    });

    it('returns a state object not strictly equal to the original', () => {
      const newState = subject(state, action);
      expect(newState).not.toBe(state);
    });

    it('doesn\'t touch the marketList array', () => {
      const { marketList } = subject(state, action);
      expect(state.marketList).toEqual(marketList);
    });
  });
  
  /*
   * Note: the rest of these tests are an EXTENSION. You should move on
   * to Enzyme testing, and come back to these later. Optionally, you may
   * just do ADD_CARD now, and come back to the rest of these redux tests later.
  */
  
   describe('ADD_CARD', () => {

    const action = {
      type: 'ADD_CARD',
      payload: 0,
    };

    it('increases card count of market specified by payload', () => {
      const addMarketAction = {
        type: 'ADD_MARKET',
        payload: 'Azkaban',
      };
      const fakeState = subject(state, addMarketAction);
      const { marketList } = subject(fakeState, action);
      expect(marketList[0]).toEqual({
        location: 'Azkaban',
        cards: 1,
      });
    });

    it('increases total card count by 1', () => {
      const { totalCards: oldTotalCards } = state;
      const { totalCards } = subject(state, action);
      expect(totalCards).toEqual(oldTotalCards + 1);
    });
      
    it('includes a marketList not strictly equal to the original', () => {
      const { marketList: newMarketList } = subject(state, action);
      expect(state.marketList).not.toBe(newMarketList);
    });
      
    it('does not mutate or duplicate other markets in marketList', () => {
      const addMarketAction = {
        type: 'ADD_MARKET',
        payload: 'Azkaban',
      };
      const secondAddMarketAction = {
        type: 'ADD_MARKET',
        payload: 'Hogwartz',
      };
      const fakeState = subject(state, addMarketAction);
      const secondFakeState = subject(fakeState, secondAddMarketAction);
      const { marketList } = subject(secondFakeState, action);
      expect(marketList[0]).toEqual({
        location: 'Azkaban',
        cards: 1,
      });
      expect(marketList[1]).toEqual({
        location: 'Hogwartz',
        cards: 0,
      });
    });
  });

  describe('DELETE_CARD', () => {
    const action = {
      type: 'DELETE_CARD',
      payload: 0,
    };

    const addMarketAction = {
      type: 'ADD_MARKET',
      payload: 'Azkaban',
    };

    const addCardAction = {
      type: 'ADD_CARD',
      payload: 0,
    };

    const fakeState = subject(state, addMarketAction);
    const secondFakeState = subject(fakeState, addCardAction)[]

    it('decreases card count of market specified by payload', () => {
      const { marketList } = subject(secondFakeState, action);
      expect(marketList[0]).toEqual({
        location: 'Azkaban',
        cards: 0,
      });
    });

    it('decreases total card count by 1', () => {
      const { totalCards: oldTotalCards } = state;
      const { totalCards } = subject(state, action);
      expect(totalCards).toEqual(oldTotalCards - 1);
    });
   });
