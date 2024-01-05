import { StyleSheet, View, Image } from 'react-native'
import React from 'react'


function Fallback() {

    return (
            <View>
                <Image source={require('../../img/to-do-list.png')} style={styles.imgStyle}/>
            </View>
    );
};
const styles = StyleSheet.create({
    imgStyle: {
        height: 300,
        width: 300,
        alignItems: "center"
    }
})
export default Fallback;

