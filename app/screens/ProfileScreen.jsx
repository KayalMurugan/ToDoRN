import { StyleSheet, Text, View, Button } from 'react-native'


function ProfileScreen(props) {

    return (
            <View style={styles.viewStyle}>
                <Text style={styles.textStyle}>Profile Screen</Text>
                <Button title='Home' onPress={()=> props.navigation.navigate('Home')}/>
            </View>
    );
};
const styles = StyleSheet.create({
    viewStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    textStyle: {
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
        marginTop: 10
    },

})
export default ProfileScreen;

