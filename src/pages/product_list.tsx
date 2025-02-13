import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import type { DataStore } from '../store/dataStore';

function App() {
  const haruMarket_productCategory_index = useSelector<DataStore, Number>((state) => state.haruMarket_productCategory_index);

  useEffect(() => {
      console.log("현재 haruMarket_productCategory_index:", haruMarket_productCategory_index);
  }, [haruMarket_productCategory_index]);

  return (
    <div>
      상품 리스트
    </div>
  );
}

export default App;
