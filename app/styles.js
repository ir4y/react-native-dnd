import {
    StyleSheet,
    Dimensions,
} from 'react-native';


const CIRCLE_RADIUS = 50;
const Window = Dimensions.get('window');
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    dropZone: {
        height: 100,
        width: 100,
        backgroundColor: '#2c3e50',
    },
    text: {
        marginTop: 35,
        marginLeft: 5,
        marginRight: 5,
        textAlign: 'center',
        color: '#fff',
    },
    draggableContainer: {
        position: 'absolute',
        top: (Window.height / 4) - CIRCLE_RADIUS,
        left: (Window.width / 2) - CIRCLE_RADIUS,
    },
    circle: {
        backgroundColor: '#1abc9c',
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS,
    },
});
