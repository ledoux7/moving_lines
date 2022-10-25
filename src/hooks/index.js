import { createTheme } from '@material-ui/core/styles';
import {
  useState, useCallback, useEffect, useRef,
} from 'react';
import themeObject from '../themes';

export const useDarkMode = () => {
  const [theme, setTheme] = useState(createTheme(themeObject));
  const [themeO, setThemeO] = useState(themeObject);
  const [darkModeState, setDarkModeState] = useState(true);

  const toggleDarkMode = useCallback(
    darkMode => {
      console.log('tgl', !darkMode);
      setDarkModeState(dm => !dm);

      const updatedTheme = {
        ...themeO,
        palette: {
          ...themeO.palette,
          type: darkMode ? 'light' : 'dark',
        },
      };
      setThemeO(updatedTheme);
    },
    [themeO],
  );

  useEffect(() => {
    setTheme(createTheme(themeO));
  }, [themeO]);

  return [theme, darkModeState, toggleDarkMode];
};

export function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach(key => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        // eslint-disable-next-line no-console
        console.log('[why-did-you-update]', name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}

// export const abcde = 123;
//
export function useKey(key) {
  // Keep track of key state
  const [pressed, setPressed] = useState(false);

  // Bind and unbind events
  useEffect(() => {
    // Does an event match the key we're watching?
    // if
    const match = event => {
      if (key === 'ctrl' && event.ctrlKey) {
        return true;
      }
      else if (key && event.key) {
        return key.toLowerCase() === event.key.toLowerCase();
        //
      }
      else {
        return false;
      }
    };

    // Event handlers
    const onDown = event => {
      if (match(event)) setPressed(true);
    };

    const onUp = event => {
      if (match(event)) setPressed(false);
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [key]);

  return pressed;
}

export default function useMultiKeyPress() {
  const [keysPressed, setKeyPressed] = useState(new Set([]));

  const downHandler = useCallback(
    ({ key }) => {
      setKeyPressed(keysPressed.add(key));
    },
    [keysPressed],
  );
  const upHandler = useCallback(
    ({ key }) => {
      keysPressed.delete(key);
      setKeyPressed(keysPressed);
    },
    [keysPressed],
  );

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]); // Empty array ensures that effect is only run on mount and unmount

  return keysPressed;
}

export const useTwoKeyCount = (k1, k2) => {
  const [bothKeysDown, setBothKeysDown] = useState(true);

  const [count, setCount] = useState(0);
  const key1 = useKey(k1);
  const key2 = useKey(k2);

  useEffect(() => {
    if (key1 && key2) {
      // console.log('setCount');
      setCount(c => c + 1);
    }
  }, [key1, key2]);

  return count;
};

export const useKeyCount = key => {
  const [count, setCount] = useState(0);
  const keyPressed = useKey(key);

  useEffect(() => {
    if (keyPressed) {
      setCount(c => c + 1);
    }
  }, [keyPressed]);

  return count;
};
