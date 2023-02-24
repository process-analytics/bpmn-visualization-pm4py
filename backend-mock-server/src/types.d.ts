// declare module "template.html!text" {
//     var html: number;
//     export default x;
// }

declare module '*.bpmn!text' {
    const content: string;
    export default content;
}
