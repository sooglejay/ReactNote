import deepFreeze from 'deep-freeze';
import expect from 'expect';


const addCounter = (list) => {
    list.push(0);
    return list;
};

const removeCounter = (list, index) => {
    list.splice(index, 1);
    return list;
};

const testAddCounter = () => {
    const listBefore = [];
    const listAfter = [0];
    deepFreeze(listBefore);
    expect(
        addCounter(listBefore).toEqual(listAfter)
    );
};

const testRemoveCounter = () => {
    const listBefore = [0, 10, 20];
    const listAfter = [0, 20];
    deepFreeze(listBefore);
    expect(
        removeCounter(listBefore, 1).toEqual(listAfter)
    );
}
