import { StyleSheet, Text, View } from 'react-native'


function HomeScreen() {

    return (
            <View style={styles.viewStyle}>
                <Text style={styles.textStyle}>Home Screen</Text>
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
export default HomeScreen;

