import React from 'react'
import SideMenu from './components/Nav/SideMenu'
import { Container, Paper, Grid } from '@material-ui/core'
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import AddService from './components/Forms/AddService';
import DeleteService from './components/Forms/DeleteService';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const UserView = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <br />
            <Container>

                <Paper className={classes.root}>
                    <SideMenu handleChange={handleChange} value={value} />

                    <Grid container direction="column" alignItems="center" justify="center">
                        <TabPanel value={value} index={0}>
                            <Typography variant="h4">Add a Service</Typography>
                            <AddService />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <DeleteService />
                        </TabPanel>
                    </Grid>

                </Paper>
            </Container>
        </React.Fragment >
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default UserView
