export const Component = function(options: any): Function {

    options.controllerAs = "vm";

    return (controller: Function) => {
        return angular.extend(options, {controller});
    };
};