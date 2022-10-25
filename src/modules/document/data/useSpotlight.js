import {newRidgeState} from 'react-ridge-state';

export const spotlightFilterState = newRidgeState(
  {
    modelConfidence: {
      filterOpen: false
    },
    progress: {
      filterOpen: false
    },
    types: {
      filterOpen: false
    },
    concepts: {
      filterOpen: false
    },
    isDefault: true
  },
  {
    onSet: (newState) => {
      localStorage.setItem('@spotlightFilterState', JSON.stringify(newState));
    }
  }
);

//Set the initial state for the spotlightFilterState into local storage
//NOTE(Rejon): Executed in InitializeState util on the first app load.
export const setInitialState = () => {
  const item = localStorage.getItem('@spotlightFilterState');
  if (item) {
    const initialState = JSON.parse(item);
    spotlightFilterState.set(initialState);
  }
};
