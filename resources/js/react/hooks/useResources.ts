import {useState, useEffect} from 'react';
import {Api} from "../tools/ApiHelper";

interface DataType {
    apiRoute: string,
    data?: object,
    method?: string,
    transformData?: (d: any) => any,
    disableAutoStart?: boolean,
    hasToken?: boolean
}


const useResources = <DType>({apiRoute, hasToken=true, data, disableAutoStart = false, method = "GET", transformData}: DataType) => {
    const initialState = {
        data: null,
        loading: !disableAutoStart,
    };
    const [state, setState] = useState<{ data: DType | null, loading: boolean }>(initialState);
    const [hasStarted, setHasStarted] = useState(false);
    const refresh = () => {
        processData();
    }
    const setData = (value: any) => {
        setState((prev: any) => ({...prev, data: value}))
    }
    const processData = async () => {
        setState(prevState => ({...prevState, loading: true}))
        let r;
        try {
            r = await Api.post({
                hasToken,
                method,
                path: apiRoute,
                data: data,
            });
            if (r.success) {
                const dd = transformData ? transformData(r.data) : r.data;
                setState({
                    data: dd,
                    loading: false
                })
                return dd;
            }
        } catch (e) { /* empty */
        }
        if (state.loading) {
            setState({
                data: null,
                loading: false
            })
        }
        return transformData ? transformData(null) : null;
    }
    useEffect(() => {
        if (!disableAutoStart && !hasStarted) {
            setHasStarted(true)
            processData();
        }
    }, []);
    return {
        ...state,
        setData,
        refresh,
        processData
    };
}

export default useResources;
