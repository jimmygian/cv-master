import React, { useState, useEffect } from 'react';
import './editor.css';
import EditorMain from './EditorMain';
import {EditorSideBar, EditorSideBtn} from './EditorSideBar';
import { usePreventReload } from '../../utils/usePreventReload'
import { ErrorBoundary } from 'react-error-boundary';
import Login from '../Home'
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../utils/GlobalContext';

export default function Editor() {
  const navigate = useNavigate();
  const { hideEditorOptions, setHideEditorOptions } = useGlobalContext();


  // Custom hook to prevent user from reloading page
  usePreventReload()

  return (
    <div className="editor-wrapper container-fluid">
      <div className="row">
        <ErrorBoundary
          FallbackComponent={Login}
          onError={() => console.log("Error happened!")}
        >
          {!hideEditorOptions && <EditorSideBar />}
          {!hideEditorOptions && <EditorSideBtn />}
          <EditorMain />
        </ErrorBoundary>
      </div>
    </div>
  );
}
