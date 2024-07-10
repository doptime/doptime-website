export const SelectRelatedFiles = (architectInfos, selectedFile, sourceCodes) => {
    var concisedVersionOfCodes = ""
    //architectInfos.map((item) => concisedVersionOfCodes += "\n;---" + item.RelFile + "---\n" + item.arch)
    architectInfos.map((item) => concisedVersionOfCodes += "\nfilename: " + item.fullname )

    var FocusedCode = !!selectedFile && "\n;---foucued-filename:" + selectedFile + "---\n" + sourceCodes[selectedFile]
    // 1.	需求分析：定义项目的核心需求和目标，明确哪些功能是必需的，哪些是次要的。
    // 2.	代码评审：逐段分析现有代码，找出错误和不合理之处。
    // 3.	模块化改进：逐个模块进行改进，每次只改动一小部分，确保改动可控。
    return `you are Context-Object driven document/sourcecode iterator;
project context & objects are given by concised version of files. there's one focused document at the top of the prompt to iterate;
your Object is to check the focused document ,study the requirement or instruction  the focused document gives, and select possible relevant files that needed  in future  to complete the instruction 


;  you are expected to do putout 1 or multiple files using format of:
[
    { name: <filename>, reason: <reason>},
     ...
]
;




` + FocusedCode + concisedVersionOfCodes
}

export const FocusedDocWithBackgroundFilesToIterate = (architectInfos, selectedFile, sourceCodes) => {
    var concisedVersionOfCodes = ""
    architectInfos.map((item) => concisedVersionOfCodes += "\n;---" + item.RelFile + "---\n" + item.arch)

    var FocusedCode = !!selectedFile && "\n;---foucued-document:" + selectedFile + "---\n" + sourceCodes[selectedFile]
    // 1.	需求分析：定义项目的核心需求和目标，明确哪些功能是必需的，哪些是次要的。
    // 2.	代码评审：逐段分析现有代码，找出错误和不合理之处。
    // 3.	模块化改进：逐个模块进行改进，每次只改动一小部分，确保改动可控。
    return `you are Context-Object driven document/sourcecode iterator;
project context & objects are given by concised version of files. there's one focused document at the top of the prompt to iterate;
your Object is to check the focused document and iterately renew the document, keeping global vision of the project & even the world in mind, to minimize the information uncentainty in Information Theory way;

;That is, you are expected to do following actions:
1. Collect & re-explain the Core Requirment of current document should be,  what is user need, what is of vital importance;
2. point out the errors & unreasonable or unnecessary parts of the focused document, or the neccessity to refactor the focused document to make it more understandable & reasonable
3. iterate the focused document,  with miminal change a to the document to make the change controllable 
4. after iteration, raise a question , the answer of which could lead to maximize the information gain of the project, or minimize the uncentainty of the project
; 

;
don't change the language of the document.
;
output style: 
<step1>:
explaination of the core requirment of the document

<step2>:
errors & unreasonable parts of the document or requrement to refactor the document

<step3_iteration>:
new iteration of the document

<step4>:
important question to raise after iteration
<stepEnd>
;

; finally you are expected to do 1 or multiple following actions:
- choose one document file to focus on which could lead to maximize the information gain of the project, by saying :
focus_on: <filename>
- remove file that could minimize infomation conflict, by saying 
remove_file: <filename>
- create file that could maximize infomation gain, by saying 
create_file: <filename>"
;




` + FocusedCode + concisedVersionOfCodes
}