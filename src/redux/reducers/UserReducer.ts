import {createReducer} from '@reduxjs/toolkit';

import {
  updateFavouritesAction,
  setIsFirstInstallAction,
  setLanguageAction,
  setThemeAction,
  setUserAction,
  addSearchRecentAction,
  removeSearchRecentAction,
  deleteAllSearchRecentAction,
  updateReadingStatusAction,
  removeReadingStatusAction,
} from '../actions/UserActions';
import Repository from 'src/data/Repository';
import {UserState} from '../ReduxTypes';
import defaultTheme, {themeJson} from 'src/shared/theme';
import {default as Language} from 'src/shared/language';
import {FAVOURITE_TYPE} from 'src/shared/Constant';
import {readingStatusesSort} from 'src/data/local/dao/UserDao';

const initialState: UserState = {
  user: {
    theme: defaultTheme,
    language: Language.getDefaultLanguage(),
    is_first_install: true,
    modify_date: 0,
    reading_statuses: [],
    favourite_mangas: [],
    favourite_authors: [],
    favourite_characters: [],
    search_recent: [],
  },
};

export const userReducer = createReducer(initialState.user, builder => {
  builder.addCase(setUserAction, (state, action) => {
    const {user} = action.payload;
    state = Object.assign(user, {
      theme: state.theme,
      language: user.language ?? state.language,
      search_recent: user.search_recent.slice(),
      reading_statuses: readingStatusesSort(user.reading_statuses.slice()),
    });
    return state;
  });
  builder.addCase(setThemeAction, (state, action) => {
    const {theme} = action.payload;
    Repository.setTheme(theme);
    state.theme = {...themeJson[theme], theme};
  });
  builder.addCase(setLanguageAction, (state, action) => {
    const {language} = action.payload;
    Repository.setLanguage(language);
    state.language = language;
  });
  builder.addCase(setIsFirstInstallAction, (state, action) => {
    const value = action.payload;
    Repository.setIsFirstInstall(value);
    state.is_first_install = value;
  });
  builder.addCase(updateFavouritesAction, (state, action) => {
    const {type, values} = action.payload;
    switch (type) {
      case FAVOURITE_TYPE.MANGA: {
        state.favourite_mangas =
          values as UserState['user']['favourite_mangas'];
        break;
      }
      case FAVOURITE_TYPE.AUTHOR: {
        state.favourite_authors =
          values as UserState['user']['favourite_authors'];
        break;
      }
      case FAVOURITE_TYPE.CHARACTER: {
        state.favourite_characters =
          values as UserState['user']['favourite_characters'];
        break;
      }
    }
  });
  builder.addCase(addSearchRecentAction, (state, action) => {
    const payload = action.payload;
    Repository.addSearchRecent(payload);
    state.search_recent.push(payload);
  });
  builder.addCase(removeSearchRecentAction, (state, action) => {
    const payload = action.payload;
    Repository.removeSearchRecent(payload);
    state.search_recent = state.search_recent.filter(
      element =>
        element !== payload &&
        element.searched_item_id !== payload.searched_item_id,
    );
  });
  builder.addCase(deleteAllSearchRecentAction, (state, _) => {
    Repository.deleteAllSearchRecent();
    state.search_recent = [];
  });
  builder.addCase(updateReadingStatusAction, (state, action) => {
    const readingStatus = action.payload;
    Repository.updateReadingStatus(readingStatus);
    let isExists = false;
    state.reading_statuses.forEach((element, index) => {
      if (element.mangaId === readingStatus.mangaId) {
        state.reading_statuses[index] = readingStatus;
        isExists = true;
        return;
      }
    });
    if (!isExists) {
      state.reading_statuses.push(readingStatus);
    }
    state.reading_statuses = readingStatusesSort(state.reading_statuses);
  });
  builder.addCase(removeReadingStatusAction, (state, action) => {
    const readingStatus = action.payload;
    Repository.removeFromReadings(readingStatus);
    state.reading_statuses = state.reading_statuses.filter(element => {
      element.mangaId !== readingStatus.mangaId;
    });
  });
});
