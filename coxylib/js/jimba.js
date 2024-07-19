/*
Version : 1.2.4
Jimba is a javascript/typescript testing, profiling, logging, tracing library  
Author:         Bernard Sibanda (Tobb Technologies Pty Ltd, Women In Move Solutions Pty Ltd)
License :       MIT License
Installation :  npm i jimba 
Date Started:   2021
What problems does it solve?
1. Trap bugs via short unit tests injected at the end of the line. E.g. const answer = add(2,4); j.test("Home", " Adding 2 and 4 must give 6",answer)
2. No need to remove the j tests like we do remove the console log because it guards against changes in tested code snippets or variables
3. Most developers are not testing because it is triple work, time consuming and expensive. Jimba.js solves this by adding tests snippets at every variable and function calls without bloating the code.
4. Jimba js is a Swiss knife: It is not only improved console.log, it is not just tracing code execution to track computation but comprehensive unit testing for javascript
5. Most simple tests or console logs use simple samples to test but Jimba copies quick test method of using arbitraries values and generating these with various ranges.
6. It has zero dependence and it is very small in size and has very few things to use
7. It speeds up javascript testing.
8. Helps also introduces testing using other libraries Mocha, Jest, Vite but is better because it is very much simplified.
9. Begins property based testing in a very simple way...
10. Very easy to install : add a script tag on a website/webapp on simple run `npm i jimba` or `npm i jimba --force`
11. A developer who needs his/her code to run fast needs to switch jimba off using the opt... switches at every page.
12. One can also selectively test code sections using j.s() and j.e() funcitons for starting and end function profiling
13. Jimba allows not only object console logging but one can toggle tracing off and on. Also one can toggle testing sections of code on and off
14. Above all it combines 3 traditonal testing functions describe(), expect() and it() into one j.test()

import {opt,j } from './jimba';
opt._R = 0; //run all
opt._FailsOnly = 0; //run only failors
opt._T = 1; // run all tests
opt._O = 0; //run j log objects tracing
opt._Ob = 0; //show objects of ComparisonMethods
opt._F = 0; // run functions only
opt._tNo = 2000; // standard number for iterations on gRvalues which is an object of arbitraries generators
opt._Min = -100; //used by gRvalues for lowest value
opt._Max = 100; //used by gRvalues for max value
opt._FUNCTIONS = []; //collects all profiled functions

Examples:
const test = undefined; j.log({test});j.test("INDEX","test",test)?.contains("null")

const name = "joe"; j.test("TEST","name",name)?.eq("joe")

const computeMult = ((x:number,y:number)=>{
  return x * y
})
const computeAdd = ((x:number,y:number)=>{
  return x + y
})
const computeDiv = ((x:number,y:number)=>{
  return x / y
})
const computeSub = ((x:number,y:number)=>{
  return x - y
})

//This is a pack of above functions with their unit test and random values from j.gNo
const testPack = (()=>{
  //1
  const firstNumber1 = j.gNo(-10000,10000),secNumber1 = j.gNo(-10000,10000)
  const ansMulti = computeMult(firstNumber1,secNumber1); j.check("ansMulti",ansMulti,200)
  //2
  const firstNumber2 = j.gNo(-10000,10000),secNumber2 = j.gNo(-10000,10000)
  const ansAdd = computeAdd(firstNumber2,secNumber2); j.test("before Home","ansAdd",ansAdd)?.neg() 
  //3
  const firstNumber3 = j.gNo(-10000,10000),secNumber3 = j.gNo(-10000,10000)
  const ansDiv = computeDiv(firstNumber3,secNumber3); j.test("before Home","ansDiv",ansDiv)?.num() 
  //4
  const firstNumber4 = j.gNo(-10000,10000),secNumber4 = j.gNo(-10000,10000)
  const ansSub = computeSub(firstNumber4,secNumber4); j.test("before Home","ansSub",ansSub)?.range(100,1000) 
  //5
  const complexCall = computeMult(computeAdd(firstNumber4,secNumber2),computeDiv(secNumber3,firstNumber1));j.test("before Home","complexCall",complexCall)?.neg() 
})

//j.trics(null) use it with null if there is no testPack
j.trics(testPack); //loops opt._tNo(see const above) times calling each unit test in the testPack  

/* output results 

17991 :  : jcheck ansMulti
j.js:242 X FAIL : Am expecting 200 but got 80696274
j.js:167 17992 : jTESTING before Home :>: ansAdd
j.js:737 ✓ PASS : -2161 :>>: negative
j.js:167 17994 : jTESTING before Home :>: ansDiv
j.js:737 ✓ PASS : -7.4268585131894485 :>>: num
j.js:167 17996 : jTESTING before Home :>: ansSub
j.js:737 ✓ PASS : -3627 :>>: range pass
j.js:167 17998 : jTESTING before Home :>: complexCall
j.js:748 X FAIL : 1325.2892981899017 :>>: negative
j.js:204 18000 :  : jcheck ansMulti
j.js:242 X FAIL : Am expecting 200 but got -13546625
j.js:167 18001 : jTESTING before Home :>: ansAdd
j.js:748 X FAIL : 6192 :>>: negative
j.js:167 18003 : jTESTING before Home :>: ansDiv
j.js:737 ✓ PASS : -0.5619785458879618 :>>: num
j.js:167 18005 : jTESTING before Home :>: ansSub
j.js:748 X FAIL : 2038 :>>: range fail
j.js:167 18007 : jTESTING before Home :>: complexCall
j.js:748 X FAIL : 2994.9406896551723 :>>: negative
j.js:427 TOTAL_PASSES : 5092
j.js:417 TOTAL_ERRORS : 4912

*/


export const opt = {
    TOTAL_FAIL : 0, 
    TOTAL_PASS : 0, 
    TOTAL_TESTS_PASS :0, 
    TOTAL_TESTS_FAIL :0,
    TOTAL_TESTS_RUN :0,
    TOTAL_WRONG_DATA_TYPES_PARAMS :0, //counts wrong parameter types mismatch given to functions
    _R : 0, //run all
    _M : 0, // trace frames for o() functions
    _FailsOnly :0, //run only failors
    _T : 0, // run all tests
    _O : 0, //run j log objects tracing
    _Ob : 0, //show objects of ComparisonMethods
    _F : 0, // run functions only
    _Tc : 1, // count tests only
    _tNo : 20, // standard number for iterations on gRvalues which is an object of arbitraries generators
    _Min : -100, //used by gRvalues for lowest value
    _Max : 100, //used by gRvalues for max value
    _FUNCTIONS : [], //collects all profiled functions
}

export const j={
    log:(o)=>{
        if(opt._O === 1 || opt._R === 1)
            {
                try 
                {
                    if(o == null || o == undefined || o == 0 || o == '')
                    {
                        console.info("%cX FAIL " , "background-color:darkred;color:#fff;");opt.TOTAL_FAIL++;
                        if(opt._M === 1)
                        {
                            console.info(o);
                        }  
                    }
                    else
                    {
                        if(typeof o == 'object' && o != null)
                        {
                            const name = Object.keys(o);  
                            const val = Object.values(o);  
                            if(val == '' || val == 0 || val == 'null' || val == 'undefined' || val == ['']) 
                            {
                                console.info("%cX FAIL " , "background-color:darkred;color:#fff;");opt.TOTAL_FAIL++;
                                console.info(o);
                            }
                            else
                            {
                                if(opt._FailsOnly === 0)            
                                {                        
                                    const nesteddValue_ = Object.values(o);
                                    if(nesteddValue_){
                                        const nesteddValue = Object.values(nesteddValue_);
                                        if(typeof Object.values(nesteddValue) == Number )
                                        {
                                            return
                                        }
                                        const st = JSON.stringify(Object.values(nesteddValue));
                                        if(!(st === "[{}]")){
                                            console.info("%c\u2713 PASS " , "background-color:darkgreen;color:#fff;");opt.TOTAL_PASS++;
                                            if(opt._M)
                                            {
                                                console.trace(o);
                                            }
                                            else
                                            {
                                                console.info(o);
                                            }
                                        }
                                        else{
                                            console.info("%cX FAIL " , "background-color:darkred;color:#fff;");opt.TOTAL_FAIL++;
                                            if(opt._M)
                                            {
                                                console.trace(o);
                                            }
                                            else
                                            {
                                                console.info(o);
                                            }
                                        }
                                    }else{
                                        console.info("%c\u2713 PASS " , "background-color:darkgreen;color:#fff;");opt.TOTAL_PASS++;
                                        if(opt._M)
                                        {
                                            console.trace(o);
                                        }
                                        else
                                        {
                                            console.info(o);
                                        }
                                    }
                                                    
                                }
                                
                            }
                        }
                        else
                        {             
                            if(((typeof o == 'number' && o > 0) || (typeof o == 'boolean' && o == true) || 
                            (typeof o == 'string' && o.trim().length > 0)))
                            {
                                if(opt._FailsOnly === 0)               
                                {
                                    console.info("%c\u2713 PASS " , "background-color:darkgreen;color:#fff;");opt.TOTAL_PASS++;
                                    if(opt._M === 1)
                                        {
                                            console.info(o);
                                        }                                    
                                } 
                            }
                            else
                            {
                                console.info("%cX FAIL " , "background-color:darkred;color:#fff;");opt.TOTAL_FAIL++;
                                if(opt._M)
                                {
                                console.trace(o);
                                }
                            }
                        }
                        
                    }
                } catch (error) {
                    console.info("%cX FAIL " , "background-color:darkred;color:#fff;");opt.TOTAL_FAIL++;
                    console.error(error)
                }
                
            }
            else
            {
                //
            }
    },
    test:(title,fTitle,actual,k=0)=>
    {
        try 
        { 
            if(opt._T === 1|| opt._R===1 || !(k === 0))
            {       
                const trackcalls = (opt._Tc++)+" : "; 
                
                 if(opt._FailsOnly === 1)
                 {
                     //
                 }
                 else
                 {
                     console.log("%c"+trackcalls+"jTESTING "+title+" :>: "+fTitle,"background-color:#fff;color:purple;");
                 }

                

                return new ComparisonMethods(actual);
            }
            else
            {
                 return new ComparisonMethods(actual);
            }

        }
        catch(error)
        {
            console.log(error.message);
        }

    },
    check:(title,varString,expectedAnswer,k=0)=>{
        const trackcalls = (opt._Tc++)+" : "; 
        const tBallConsole = "%c"+trackcalls+" : jcheck " + title;
        const cssBlue = "background-color:#fff;color:blue;";
        if(!title || !varString || !expectedAnswer)
        {
            if(opt._T == 1)
            {                
                console.log(tBallConsole,cssBlue);
                opt.TOTAL_TESTS_FAIL++;
                const res = varString?varString:" nothing.";    
                console.log("%c"+title,"background-color:purple;color:white;")
                console.log(varString);   
                console.log(expectedAnswer);     
                console.log("%cX FAIL : First three parameters are mandatory!","background-color:#fff;color:red;");opt.TOTAL_FAIL++;        
                return
            }
        }
        
        opt.TOTAL_TESTS_RUN++;
    
        if (opt._R || (k !== 0)||(opt._T == 1))
        {
            typeof varString === 'string';
    
            if(opt._FailsOnly === 1)
            {
               // 
            }
            else
            {
              console.log(tBallConsole,cssBlue);   
            }
    
            if(varString === undefined || varString == null)
            {
                    opt.TOTAL_TESTS_FAIL++;
                    const res = varString?varString:" nothing.";
                    console.log("%cX FAIL : UNDEFINED!","background-color:#fff;color:red;");opt.TOTAL_FAIL++;
            }
            else if(typeof varString === 'string' && typeof expectedAnswer === 'string')
            {
    
                if((varString.localeCompare(expectedAnswer)) === 0)
                {
                    if(opt._FailsOnly === 0)
                    {
                        console.log("%c✓ PASS : " + varString,"background-color:#fff;color:green;"); opt.TOTAL_PASS++;opt.TOTAL_TESTS_PASS++;
                    }
                }
                else
                {   opt.TOTAL_TESTS_FAIL++;
                    const res = varString?varString:" nothing.";
                    console.log("%cX FAIL : Am expecting " + expectedAnswer + " but got " + res,"background-color:#fff;color:red;");opt.TOTAL_FAIL++;
                }
            }
            else if(typeof varString === 'number' && typeof expectedAnswer === 'number')
            {
                    
                if((varString === expectedAnswer) === true)
                {
                    if(opt._FailsOnly === 0)
                    {
                        console.log("%c✓ PASS : " + varString,"background-color:#fff;color:green;");opt.TOTAL_PASS++;opt.TOTAL_TESTS_PASS++;
                    }
                }
                else
                {   
                    opt.TOTAL_TESTS_FAIL++;
                    const res = varString?varString:" nothing.";
                    console.log("%cX FAIL : Am expecting " + expectedAnswer + " but got " + res,"background-color:#fff;color:red;");opt.TOTAL_FAIL++;
                    if(opt._Ob === 1)
                    {
                        console.trace(res);
                    }
                }
            }
            else if(typeof varString === 'boolean' && typeof expectedAnswer === 'boolean')
            {
     
                if((varString === expectedAnswer) === true)
                {
                    if(opt._FailsOnly === 0)
                    {
                        console.log("%c✓ PASS : " + varString,"background-color:#fff;color:green;");opt.TOTAL_PASS++;opt.TOTAL_TESTS_PASS++;
                    }
                }
                else
                {   
                    opt.TOTAL_TESTS_FAIL++;
                    const res = varString?varString:" nothing.";
                    console.log("%cX FAIL : Am expecting " + expectedAnswer + " but got " + res,"background-color:#fff;color:red;");opt.TOTAL_FAIL++;
                }
            }
            else if(Array.isArray(varString) && Array.isArray(expectedAnswer))
            {
   
                if((compareArrays(varString, expectedAnswer)) === true)
                {
                    if(opt._FailsOnly === 0)
                    {
                     console.log("%c✓ PASS : " + varString,"background-color:#fff;color:green;");opt.TOTAL_PASS++;opt.TOTAL_TESTS_PASS++;          
                    }
                }
                else
                {   
                    opt.TOTAL_TESTS_FAIL++;
                    const res = varString?varString:" nothing.";
                    console.log("%cX FAIL : Am expecting " + expectedAnswer + " but got " + res,"background-color:#fff;color:red;");opt.TOTAL_FAIL++;
                }
            }
            else if(typeof varString === 'object' && typeof expectedAnswer === 'object')
            {
                if(opt._T === 1)
                {       
        
                        if((compareObjects(varString,expectedAnswer)) === true)
                        {
                            if(opt._FailsOnly === 0)
                            {
                                console.log("%c✓ PASS : " + varString,"background-color:#fff;color:green;");opt.TOTAL_PASS++;opt.TOTAL_TESTS_PASS++;
                            }
                        }
                        else
                        {   
                            opt.TOTAL_TESTS_FAIL++;
                            const res = varString?varString:" nothing.";
                            console.log("%cX FAIL : Am expecting " + expectedAnswer + " but got " + res,"background-color:#fff;color:red;");opt.TOTAL_FAIL++;
                        }
                }
            }    
            else
            {   opt.TOTAL_WRONG_DATA_TYPES_PARAMS++;
                console.log(varString);
                console.log(expectedAnswer);
                console.log("%c WRONG DATA TYPES GIVEN! First param is of : " + typeof varString + ", Second param is of : " + typeof expectedAnswer,"background-color:#fff;color:red;");
            }
            
            
        }
        else
        {
            //
        }
    },
    s:(label,k=0)=>{
        if(!(k == 0))
        {
            opt.tS_ = true;
        }   
        
        if(label && (opt._F || opt._R || !(k == 0)))
        {
            opt._FUNCTIONS.push(label);
    
            console.log("%cFunc starts : "+opt._FUNCTIONS,"background-color:#fff;color:purple;")
    
            console.time("TIME : "+label);       
        }
    },
    e:(label,k=0)=>{
        if(!(k == 0))
        {
            opt.tS_ = true;
        }   
        
        if(label && (opt._F || opt._R || !(k == 0)))
        {
            opt._FUNCTIONS.push(label);
    
            console.log("%cFunc ends : "+opt._FUNCTIONS,"background-color:#fff;color:purple;")
    
            console.timeEnd("TIME : "+label);       
        }
    },
    rTP:(fn,n=opt._tNo)=>{
        for (let i = 0; i < n; i++) { 
            fn()
        }        
    },
    trics:(fn,n=opt._tNo,k=0)=>{        
        if(fn != null && (typeof fn === 'function') )
        {
            for (let i = 0; i < n; i++) { 
                fn()
            } 
        } 

        passes(k),fails(k);funcs(k);tests(k);
    },
    hexR : () => {
      let n = (Math.random() * 0xfffff * 1000000).toString(16);
      return n;
    }
    ,
    gNo:(min=opt._Min, max=opt._Max)=>{
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    gDec:()=>{
        return Math.random()
    },
    gANo:(min=opt._Min, max=opt._Max)=>{
        min = min;
        max = max;
        return (Math.random() * (max - min + 1)) + min;
    },
    gBool:(n=1)=>{
        n = n > 0? n : opt._tNo;
        const arrBool = [];
        for (let i = 0; i < n; i++) {
            arrBool.push(Math.random() < 0.5)        
        }    
        return arrBool;
    },
    gNull:(n=1)=>{
        n = n > 0? n : opt._tNo;
        const negativeNo = gRValue.gNo(-1000,-1);
        const nulls = [{empty:null},{empty:undefined},{empty:"null"},{empty:"undefined"},,null, undefined,0,'',"",{empty:[0]},{empty:""},
        {empty:''},{empty:"0"},{empty:0},{empty:[]},{empty:{}},[0],[],[''],[""],{},negativeNo];
        const nullArray = [];
        for (let i = 0; i < n; i++) {
            nullArray.push(nulls[Math.floor(Math.random()*nulls.length)]);        
        }
        return nullArray;
    },
    chrs:(len=10)=>{        
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_?|[]{}:",.!@#$%^&*()+~`';
        return charProcess(characters,len);
    },
    upperC:(length=10)=>{        
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return charProcess(characters,length)
    },
    lowerC:(length=10)=>{        
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        return charProcess(characters,length)
    },
    digts:(length=10)=>{        
        const characters = '0123456789';
        return charProcess(characters,length)
    },
    symbls:(len=10)=>{        
        const characters = `'-_?|[]{}:",.!@#$%^&*()+~\\><=`;
        return charProcess(characters,len);
    }
}

function fails(k=0){
    if(opt._O || opt._T ==1|| opt._R || !(k == 0))
    {
        if(opt.TOTAL_FAIL > 0)
        {
            console.log("%cTOTAL_ERRORS : " + opt.TOTAL_FAIL,"background-color:#fff;color:darkred;");
        }
    }
    
}

function passes(k=0){
    if(opt._O || opt._T ==1|| opt._R || !(k == 0))
    {
        if(opt.TOTAL_PASS > 0){
            console.log("%cTOTAL_PASSES : " + opt.TOTAL_PASS,"background-color:#fff;color:blue;");
        }
    }
    
}

function funcs(k=0){
    if((opt. O || opt._T ==1|| opt._R || opt.tS ) && (!(k == 0) || (opt._FUNCTIONS.length > 0)))
    {
        const fT = opt._FUNCTIONS.length;
        console.log("%cTOTAL_FUNCTIONS : " + fT,"background-color:#fff;color:purple;");
        const funcs_ = opt._FUNCTIONS.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
        console.log(funcs_);
    }

}

function tests(k=0){

   
    if(opt.T == 1){opt.tS  = false;}

    if((opt.T ==1|| opt._R || opt.tS ) && (!(k == 0) || (opt.TOTAL_TESTS_PASS > 0)))
    {
        console.log("%cTOTAL_TESTS_PASS : " + opt.TOTAL_TESTS_PASS,"background-color:blue;color:#fff;"); 
    }
    if((opt.T ==1|| opt._R || opt.tS ) && (!(k == 0) || (opt.TOTAL_TESTS_FAIL > 0)))
    {
        console.log("%cTOTAL_TESTS_FAIL : " + opt.TOTAL_TESTS_FAIL,"background-color:darkred;color:#fff;"); 
    }
    if((opt.T ==1|| opt._R || opt.tS ) && (!(k == 0) || (opt.TOTAL_TESTS_RUN > 0)))
    {
        console.log("%cTOTAL_TESTS_RUN : " + opt.TOTAL_TESTS_RUN,"background-color:blue;color:#fff;"); 
    }
    if((opt.T ==1|| opt._R || opt.tS ) && (!(k == 0) || (opt.TOTAL_WRONG_DATA_TYPES_PARAMS > 0)))
    {
        console.log("%cTOTAL_WRONG_DATA_TYPES_PARAMS : " + opt.TOTAL_WRONG_DATA_TYPES_PARAMS,"background-color:blue;color:#fff;"); 
    }

}

const compareArrays = (a, b) => {    
    return JSON.stringify(a) === JSON.stringify(b);
};

const compareObjects = (a, b) => {    

    if(typeof a == 'object' && typeof b == 'object' ){

        const aObjElementTotal = a.length;
        const bObjElementTotal = a.length;

        const objTotalSame = aObjElementTotal === bObjElementTotal;

        if(!objTotalSame){
            return false;
        }
        else{
                const  aKeysArray = Object.keys(a);
                const aKeysArraySorted = aKeysArray.sort();
                const  aValuesArray = Object.keys(a);
                const aValuesArraySorted = aValuesArray.sort();

                const  bKeysArray = Object.keys(b);
                const bKeysArraySorted = bKeysArray.sort();
                const  bValuesArray = Object.keys(b);
                const bValuesArraySorted = bValuesArray.sort();

                if(compareArrays(aKeysArraySorted,bKeysArraySorted) && compareArrays(aValuesArraySorted,bValuesArraySorted))
                {
                    return true;
                }
                else
                {
                    return false;
                }

        }    

    }
    else{
        return false;
    }

};

class ComparisonMethods {
    constructor(actual,expectedValue="",k=0) {
      this.actual = actual;
      this.expectedValue = expectedValue;
      this.k = k;
    }  
    between(start,end)
    {
        if(this.actual >= start && this.actual <= end)
        {
            pass(this.actual,this.expectedValue,k); 
        } 
        else 
        {
            fail(this.actual,this.expectedValue,k);   
        }
    }
    eq(expected,k=0) 
    {

        if (expected === this.actual) 
        {
            pass(this.actual,expected,k); 
        } 
        else 
        {
            fail(this.actual,expected,k); 
        }
    }
    gt(expected,k=0) {
        if (this.actual > expected) 
        {
            pass(this.actual,expected,k); 
        } 
        else 
        {
            fail(this.actual,expected,k); 
        }
      }
      lt(expected,k=0) {
        if (this.actual < expected) 
        {
            pass(this.actual,expected,k); 
        } 
        else 
        {
            fail(this.actual,expected,k); 
        }
      }
    geq(expected,k=0) {
        if (this.actual >= expected) 
        {
            pass(this.actual,expected,k); 
        } 
        else 
        {
            fail(this.actual,expected,k); 
        }
      }
    leq(expected,k=0)
    {

        if (expected >= this.actual) 
        {
            pass(this.actual,expected,k); 
        } 
        else 
        {
            fail(this.actual,expected,k); 
        }
    }
    contains(expected,k=0)
    { 
        if(this.actual)
        {
            console.log(this.actual);
            console.log(expected);
                if (this.actual.toString().includes(expected)) 
                {
                    pass(this.actual,"contains "+expected,k); 
                } 
                else 
                {
                    fail(this.actual,"contains "+expected,k);           
                }
        }
        else
        {
            const got = this.actual;

            if(typeof got == "undefined")
            {
                fail(this.actual,"contains undefined ",k); 
            }
            else if(typeof got == "null")
            {
                fail(this.actual,"contains null ",k); 
            }     
        }
        
      }
    null(k=0)
    {
        const nulls = [{empty:null},{empty:undefined},{empty:"null"},{empty:"undefined"},,null, undefined,0,'',"",{empty:[0]},{empty:""},{empty:''},{empty:"0"},{empty:0},{empty:[]},{empty:{}},[0],[],[''],[""],{}]; 
        
        if (nulls.includes(this.actual)) 
        {
            pass(this.actual,"null",k); 
        } 
        else 
        {
            fail(this.actual,"null",k); 
        }
      }
      notNull(k=0)
      {
            const nulls = [{empty:null},{empty:undefined},{empty:"null"},{empty:"undefined"},,null, undefined,0,'',"",{empty:[0]},{empty:""},{empty:''},{empty:"0"},{empty:0},{empty:[]},{empty:{}},[0],[],[''],[""],{}]; 
            if (!nulls.includes(this.actual)) 
            {
                pass(this.actual,"notNull",k); 
            } 
            else 
            {
                fail(this.actual,"notNull",k);           
            }
        }
    object(k=0)
    {
        if ('object' === typeof this.actual) 
        {
            pass(this.actual,"object",k); 
        } 
        else 
        {
            fail(this.actual,"object",k); 
        }
      }
    array(k=0) 
    {
        if (Array.isArray(this.actual)) 
        {
            pass(this.actual,"array",k); 
        } 
        else 
        {
            fail(this.actual,"array",k); 
        }
      }
    neg(k=0) 
    {
        if (this.actual < 0) 
        {
            pass(this.actual,"negative",k); 
        } 
        else 
        {
            fail(this.actual,"negative",k); 
        }
      }
    pos(k=0)
    {
        if (this.actual >= 0) 
        {
            pass(this.actual,"positive",k); 
        } 
        else 
        {
            fail(this.actual,"positive",k); 
        }
      }
    bool(k=0)
    {
        if (typeof this.actual ===  'boolean') 
        {
            pass(this.actual,"bool",k); 
        } 
        else 
        {
            fail(this.actual,"bool",k); 
        }
      }
    notBool(k=0)
    {
        if (typeof this.actual !=  'boolean') 
        {
            pass(this.actual,"notBool",k); 
        } 
        else 
        {
            fail(this.actual,"notBool",k); 
        }
      }
    num(k=0)
    {
        if (typeof this.actual === 'number') 
        {
            pass(this.actual,"num",k); 
        } 
        else 
        {
            fail(this.actual,"num",k); 
        }
      }
      range(min=0,max=100,k=0)
      {
          if (this.actual >= min, this.actual <= max) 
          {
              pass(this.actual,"range pass",k); 
          } 
          else 
          {
              fail(this.actual,"range fail",k); 
          }
        }
    string(k=0)
    {
        if (typeof this.actual ===  'string') 
        {
            pass(this.actual,"string",k); 
        } 
        else 
        {
            fail(this.actual,"string",k);         
        }
      }
     
        
}

function pass(exp,expectedValue,k)
  {
    if((opt._R === 1)|| (k !== 0)||(opt._T === 1))
    {
        if(opt._FailsOnly === 0) 
        {
            const trackcalls = (opt._Tc++)+" : "; 
            console.log("%c✓ PASS : " + exp + " :>>: "+expectedValue,"background-color:#fff;color:green;");opt.TOTAL_PASS++;opt.TOTAL_TESTS_PASS++;
            if(opt._Ob === 1){
                console.trace(exp)
            }
        }
    }
}

function fail(exp,expectedValue,k){
    if((opt._FailsOnly === 1) || opt._R || (k !== 0)||(opt._T == 1))
    {   const trackcalls = (opt._Tc++)+" : "; 
        console.log("%cX FAIL : " + exp + " :>>: "+expectedValue,"background-color:#fff;color:red;");opt.TOTAL_FAIL++;opt.TOTAL_TESTS_FAIL++;
        if(opt._Ob === 1)
        {
            console.trace(exp)
        }
    }
}
  
const charProcess=(characters="abcdefghijklmnopqrstuvwxyz",length=10)=>{
 if(length > 0) 
 {
        let counter = 0;
        let result = '';
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
        }
        return result; 
  }
  else
  {
    return "";
  }
}
