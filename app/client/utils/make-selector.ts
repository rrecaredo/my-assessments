export default function ms(component : ng.IComponentOptions) : string {
    let replace = (str: string) : string => str.replace(/\W+(.)/g, function (x, chr) {
        return chr.toUpperCase(); });

    if (component.hasOwnProperty('selector')) {
        return replace((<any>component).selector);
    } else {
        throw new Error('Components must declare a selector');
    }
}