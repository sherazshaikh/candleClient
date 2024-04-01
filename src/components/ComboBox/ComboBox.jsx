import * as React from 'react';
import TextField from '@mui/material/TextField';
import { executeApi } from '../../utils/WithAuth';
import { variables } from '../../utils/config';
import { useDispatch } from 'react-redux';
import { updateCart } from '../../pages/redux/features/cart/cartslice';
import { FormControl, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import '../Input/input.css'
import { AutoComplete, Input } from 'antd';

export default function ComboBox({ debouncedApiCall, label, index, rows, setRows, options = [], baseURL, token }) {

  const dispatch = useDispatch();
  const [infoLabel, setInfoLabel] = React.useState(rows[index]['LottypeCode']['label'])
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [open, setOpen] = React.useState(false);
  const [ddOption, setDdOption] = React.useState([{ label: "loading...", value: "loading..." }]);

  React.useEffect(() => {
    console.log(infoLabel);
    if (infoLabel == "") {
      updateProduct()
      let abcd = options.map((option) => {
        return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty }
      })
      setDdOption(abcd)
      console.log(abcd, "abcdefg");

    } else {
      let abcd = options.filter((option) => {
        if ((option.productDesc.toLowerCase()).includes(infoLabel.toLowerCase())) {
          return option
  
        }
      })
      abcd = abcd.map((option) => {
        return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty }
      })
      setDdOption(abcd)
      console.log(abcd, "abcdefg");

    }
    setOpen(true)

  }, [infoLabel])

  React.useEffect(() => {
    console.log(infoLabel);
    if (infoLabel == "") {
      let abcd = options.map((option) => {
        return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty }
      })
      setDdOption(abcd)
    } else {
      let abcd = options.filter((option) => {
        if ((option.productDesc.toLowerCase()).includes(infoLabel.toLowerCase())) {
          return option

        }
      })
      abcd = abcd.map((option) => {
        return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty }
      })
      setDdOption(abcd)
    }
    setOpen(true)

  }, [options])


  const updateProduct = (value, e) => {
    let newArray = [...rows];
    console.log(e);
    if (value) {
      newArray[index] = { ...rows[index], LottypeCode: value ? e : { label: "", HsCode: "", value: "" }, selectedYardage: { label: e.yardage, value: e.yardage, HsCode: e.yardage }, OrderQty: e.boxQty };
      setInfoLabel(e.label)
      executeApi(baseURL + variables.shades.url + `?productCode=${e.value}`, {}, variables.shades.method, token, dispatch)
        .then(data => {
          console.log(data);
          newArray[index] = { ...newArray[index], shade: data.data ? data.data : [] }
        })
        .then(() => {
          // executeApi(baseURL + variables.yardage.url + `?productCode=${e.value}`, {}, variables.yardage.method, token, dispatch)
          //   .then(data => {
          //     newArray[index] = { ...newArray[index], yardage: data.data ? data.data : [], selectedYardage: { label: data.data[0], value: data.data[0], HsCode: data.data[0] } }
          dispatch(updateCart(newArray));
          //   })
          //   .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
    } else {
      setInfoLabel("")
      newArray[index] = { ...rows[index], LottypeCode: { label: "", HsCode: "", value: "" }, ShadeCode: { label: "", HsCode: "", value: "" }, selectedYardage: { label: "", HsCode: "", value: "" }, shade: [] }
      dispatch(updateCart(newArray));
    }
  }


  return (
    <>
      <AutoComplete
        options={ddOption}
        placeholder="Select Product"
        allowClear={true}
        value={infoLabel}
        onSelect={(e, v) => updateProduct(e, v)}
        onSearch={(v) => setInfoLabel(v)}
        onClear={() => updateProduct()}
        style={{ width: "90%", height: "40px", boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);", background: isMobile ? "white" : "transparent", borderRadius: { xs: "8px" } }}
      />

    </>
  );
}

export function ShadeBox({ debouncedApiCall, label, index, rows, setRows, options = [], baseURL, token }) {

  const dispatch = useDispatch();
  const [infoLabel, setInfoLabel] = React.useState("")
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [ddOption, setDdOption] = React.useState(options);

  React.useEffect(() => {
    console.log(infoLabel);
    if (infoLabel == "") {
      let newArray = [...rows];
      newArray[index] = { ...rows[index], ShadeCode: { label: "", HsCode: "", value: "" } }
      dispatch(updateCart(newArray));
      let abcd = options.map((option, ind) => {
        return { label: option.shadeCode, value: option.shadeDesc,  key: ind }
      })
      setDdOption(abcd)
    } else {
      let abcd = options.filter((option) => {
        if (option.shadeCode.includes(infoLabel.toString())) {
          return option
        }
      })
      abcd = abcd.map((option, ind) => {
        return { label: option.shadeCode, value: option.shadeDesc, key: ind }
      })
   
      setDdOption(abcd)
      // setTimeout(()=> abcd?.length === 0 && setInfoLabel(""), 1100)
    } 

  }, [infoLabel])

  React.useEffect(() => {
    console.log(infoLabel);
    if (!infoLabel) {
      let abcd = options.map((option, ind) => {
        return { label: option.shadeCode, value: option.shadeDesc, key: ind, }
      })
      console.log(abcd);
      setDdOption(abcd)
    } else {
      let abcd = options.filter((option) => {
        if (option.shadeCode.includes(infoLabel.toString())) {
          return option
        }
      })
      abcd = abcd.map((option, ind) => {
        return { label: option.shadeCode, value: option.shadeDesc, key: ind, }
      })
      setDdOption(abcd)
    }

  }, [options])


  const updateProduct = (value, e) => {
<<<<<<< HEAD
    let newArray = [...rows];
    setInfoLabel(e ? e.label : '')
=======
    let newArray = [...rows];    
    setInfoLabel(e ? e.label : '' )
>>>>>>> 9564b344e942f567e752efed9824d0356841bc02
    newArray[index] = { ...rows[index], ShadeCode: value ? e : { label: "", HsCode: "", value: "" } }
    dispatch(updateCart(newArray));
  }


  return (
    <>
      <AutoComplete
        options={ddOption}
        placeholder="Select Shade"
        allowClear={true}
        value={infoLabel ? infoLabel : rows[index]['ShadeCode']['label']}
        onSelect={(e, v) => updateProduct(e, v)}
        onSearch={(v) => setInfoLabel(v)}
        onClear={() => updateProduct()}
        style={{ width: "90%", height: "40px", boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);", background: isMobile ? "white" : "transparent", borderRadius: { xs: "8px" } }}
        children={<Input type='number' style={{ height: "40px", boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);", background: isMobile ? "white" : "transparent", borderRadius: { xs: "8px" } }}
        />}
      />

    </>
  );
}

export function YardageBox({ debouncedApiCall, label, index, rows, setRows, options = [], baseURL, token }) {

  const dispatch = useDispatch();
  const [infoLabel, setInfoLabel] = React.useState("")
  const isMobile = useMediaQuery('(max-width: 600px)')
  const [ddOption, setDdOption] = React.useState([]);

  React.useEffect(() => {
    if (!infoLabel) {
      let abcd = options.map((option) => {
        return { label: option, value: option }
      })
      setDdOption(abcd)
    } else {
      let abcd = options.filter((option) => {
        if (option.includes(infoLabel)) {
          return option
        }
      })
      abcd = abcd.map((option) => {
        return { label: option, value: option }
      })
      setDdOption(abcd)
    }

  }, [infoLabel])


  const updateProduct = (value, e) => {
    let newArray = [...rows];
    newArray[index] = { ...rows[index], selectedYardage: value ? e : { label: "", HsCode: "", value: "" } }
    dispatch(updateCart(newArray));
  }


  return (
    <>
      <AutoComplete
        options={ddOption}
        placeholder="Select Yardage"
        allowClear={true}
        disabled={true}
        value={rows[index]['selectedYardage']['label']}
        // onSelect={(e, v) => updateProduct(e, v)}
        // onSearch={(v) => setInfoLabel(v)}
        style={{ width: "90%", height: "40px", boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);", background: isMobile ? "white" : "transparent", borderRadius: { xs: "8px" } }}
      />

    </>
  );
}