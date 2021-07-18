import React, { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import './Donate.css'
import axios from 'axios'

import {
    Box,
    Typography,
    Snackbar,
    Backdrop,
    CircularProgress,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import MaterialTable from 'material-table';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
class AddProduct extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            snakbar: false,
            loading: false,
            Description: { error: "", value: "" },
            address: { error: "", value: "" },
            any_other: { error: "", value: "" },
            images: [],
            columns: [
                { title: 'item_name', field: 'item_name' },
                { title: 'availability', field: 'availability' },
                { title: 'spoil_in_hrs', field: 'spoil_in_hrs' },
            ],
            data: [
            ]
        }
    }

    handleInputChange = (e) => {

        this.setState({
            [e.target.name]: { error: "", value: e.target.value }
        })
    }

    uploadImageURL = (item) => {
        try {


            return URL.createObjectURL(item)
        } catch (error) {
            return item
        }
    }

    removeImage = index => {
        let images = this.state.images;

        let image = images[index];
        images.splice(index, 1)

        try {

            if (image.startsWith("https")) {
                //console.log("qEDa");
                this.setState(
                    { loading: true },
                    this.deleteImage([image], 0, () => {
                        this.setState({
                            images,
                        });
                    })
                );
            }

        } catch (error) {
            this.setState({
                images,
            });
        }

        this.setState({
            images,
        })
    }






    savePostData = async () => {
        // console.log(this.state);
        // return;

        if (this.state.images.length < 1) {
            console.log("add atleast 3 images");
            return;
        }
        const imgUrls = [];
        console.log("loading")

        this.state.images.map(async (image) => {
            const data = new FormData();
            data.append('file', image);
            data.append('upload_preset', "SocialMedia");
            data.append('cloud_name', "djqrcbjmu");
            const data1 = await fetch("	https://api.cloudinary.com/v1_1/djqrcbjmu/image/upload", {
                method: "post",
                body: data
            });
            const data2 = await data1.json();
            const url = await data2.secure_url;
            imgUrls.push(url);
            if (imgUrls.length === this.state.images.length) {
                const sdata = {};
                sdata['images'] = imgUrls;
                sdata['postedBy'] = this.props.id;
                sdata['lat'] = "22";
                sdata['lon'] = "33";
                sdata['address'] = this.state.address.value;
                sdata['description'] = this.state.Description.value;
                sdata['any_other'] = this.state.any_other.value;
                sdata['fooditems'] = this.state.data;
                console.log(sdata);

                const upload = await axios.post('/api/post/addpost', sdata);
                console.log(upload)

                let y = imgUrls.length;
                this.setState({
                    images: [],
                    Description: { error: "", value: "" },
                    address: { error: "", value: "" },
                    any_other: { error: "", value: "" },
                    data: [],
                });
                while (y--)
                    this.removeImage();

            }

        });







    }

    render() {
        return (
            <Box className="Donate" bgcolor="white" boxShadow={1} p={4} style={{
                maxWidth: "700px",
            }}>

                <Typography variant="h5" gutterBottom>
                    Add product
                </Typography>


                <Box display="flex" flexWrap="true">
                    {this.state.images.map((item, index) => (
                        <Box margin="12px">
                            <img
                                src={this.uploadImageURL(item)}
                                style={{ height: "90px", width: "160px" }} />
                            <br />
                            <IconButton
                                aria-label="delete"
                                onClick={e => this.removeImage(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                <input
                    accept="image/*"
                    hidden
                    id="contained-button-file"
                    onChange={(e) => {

                        // {console.log(this.state.images.length)}
                        if (e.target.files && e.target.files[0]) {
                            let images = this.state.images;

                            images.push(e.target.files[0]);
                            this.setState({
                                images: images,
                            })
                            e.target.value = null;
                        }
                    }}
                    type="file"
                />

                <br />

                <label htmlFor="contained-button-file" className="donate-btn">
                    <span >Add Image</span>
                </label>

                <br />
                <br />

                <textarea style={{ width: "100%" }}
                    className="donate-input"
                    name="Description"
                    type="text"
                    error={this.state.Description.error}
                    placeholder="Description"
                    onChange={(e) => this.handleInputChange(e)}
                    value={this.state.Description.value}
                />

                <div className="place-wrapper">

                    <textarea
                        className="donate-input"
                        name="address"
                        type="text"
                        error={this.state.address.error}
                        placeholder="address"
                        onChange={(e) => this.handleInputChange(e)}
                        value={this.state.address.value}
                    />
                </div>

                <textarea
                    className="donate-input"
                    style={{ width: "100%" }}
                    name="any_other"
                    type="text"
                    error={this.state.any_other.error}
                    placeholder="any_other"
                    onChange={(e) => this.handleInputChange(e)}
                    value={this.state.any_other.value}
                />
                <br />
                <MaterialTable
                    icons={tableIcons}
                    options={{ search: false, paging: false }}
                    title="Add Food Items here"
                    columns={this.state.columns}
                    data={this.state.data}
                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    this.setState({
                                        data: [...this.state.data, newData]
                                    })

                                    resolve();
                                }, 1000)
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    const dataUpdate = [...this.state.data];
                                    const index = oldData.tableData.id;
                                    dataUpdate[index] = newData;
                                    this.setState({
                                        data: [...dataUpdate]
                                    })

                                    resolve();
                                }, 1000)
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    const dataDelete = [...this.state.data];
                                    const index = oldData.tableData.id;
                                    dataDelete.splice(index, 1);
                                    this.setState({
                                        data: [...dataDelete]
                                    })

                                    resolve();
                                }, 1000)
                            }),
                    }}
                />

                <br />

                <label className="donate-btn" onClick={() => this.savePostData()}>
                    <span >Upload</span>
                </label>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snakbar}
                    autoHideDuration={1000}
                    onClose={e => this.setState({
                        snakbar: false
                    })}
                    message={this.state.snackbar_error}
                />

                <Backdrop
                    style={{ zIndex: "1600" }}
                    open={this.state.loading} >
                    <CircularProgress color="primary" />
                </Backdrop>

            </Box>
        )
    }
}


export default (AddProduct);