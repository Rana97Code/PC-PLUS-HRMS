import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';


const index = () => {

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                <h2 className="text-xl font-bold">Generate Mushak</h2>
            </div>

            <div className="pt-5">
                {/*----------------- User list start ---------------*/}
                <div className="panel col-span-3 " id="stack_form">
                    <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                        <div className="flex items-center justify-between mb-3">
                            <Link to="/pages/report/mushak61/index" className="btn btn-success gap-1">
                                Generate Mushak-6.1
                            </Link>
                            <Link to="/pages/report/mushak62/index" className="btn btn-success gap-1 ml-10">
                                Generate Mushak-6.2
                            </Link>
                            <Link to="/pages/report/mushak610/index" className="btn btn-success gap-1 ml-10">
                                Generate Mushak-6.10
                            </Link>
                            <Link to="/pages/report/mushak91/index" className="btn btn-info gap-1 ml-10">
                                Generate Mushak-9.1
                            </Link>
                            {/* <Link to="/pages/report/subform-ka/index" className="btn btn-success gap-1 ml-20">
                                Sub-Form-ক
                            </Link>
                            <Link to="/pages/report/subform-kha/index" className="btn btn-success gap-1 ml-20">
                                Sub-Form-খ
                            </Link>
                             */}
                        </div>
                    </div>
                    <div className="datatables">
                    </div>
                </div>
                {/*-------------- User list end -------------*/}

                
            </div>
        </div>
    );
};

export default index;