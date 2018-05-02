/*

<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.1.1.min.js"></script>

<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>

var obj_1 = [
    {
        title: "Header",
        info: "",
        child:[
            {
                title: "基本操作",
                info: "",
                child:[...]
            },
            ...
        ]
    },
    ...
];

let inputli = createViewTree([JQelement, ex: $("#tree")], obj_1, [if expand, true || false]);

inputli.showSelect([value you want to show in the View tree]);
*/
function createViewTree(_elem, _obj, expand){
    let _body = $(`<div class="tree"/>`).appendTo(_elem);
    addChileNode($(`<ul root="true" class="tree_ul"></ul>`).appendTo(_body), _obj, expand);

    _body.find('li:has(ul)').addClass('parent_li');
    _body.find('li.parent_li > button').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).find(' > span').addClass('glyphicon-plus').removeClass('glyphicon-minus');
        } else {
            children.show('fast');  
            $(this).find(' > span').addClass('glyphicon-minus').removeClass('glyphicon-plus');
        }
        e.stopPropagation();
    });
    _body.showSelect = function(_val){
        _body.find(".tree_leaf").each(function(){
            if($(this).html().toUpperCase().includes(_val.toUpperCase())){
                $(this).show('fast');
            }
            else{
                $(this).hide('fast');
            }
        });
    }
    return _body;
}

function addChileNode(_elem, _obj, expand){
	_obj.forEach(function(o){
		let _child_root = $(`<li class="tree_li ${o.child ? "" : "tree_leaf"}"></li>`).appendTo(_elem);
        _child_root.append(`
            <button type="button" class="btn btn-default btn-sm">
            <span class="glyphicon ${ o.child ? (expand ? "glyphicon-minus" : "glyphicon-plus") : "glyphicon-file"}"></span> ${o.title}
            </button>
            <a class="click_a" href="#">${o.info}</a>`);
        if(isFunction(o.click)){
            _child_root.find(".click_a").on("click", function(e){o.click(this);});
        }

		if(o.child){
			addChileNode($(`<ul class="tree_ul"></ul>`).appendTo(_child_root), o.child, expand);
		}
        if(_elem.attr("root") != "true" && !expand)
            _child_root.hide('fast');
	});
}

function isFunction(functionToCheck) {
   var getType = {};
   return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function addCSS(){
    $("html").append(`<style type="text/css">
        .tree {
            width:100%,
            height:100%
        }
        .tree_li {
            list-style-type:none;
            margin:0;
            padding:10px 5px 0 5px;
            position:relative
        }
        .tree_li::before, .tree li::after {
            content:'';
            left:-20px;
            position:absolute;
            right:auto
        }
        .tree_li::before {
            border-left:1px solid #999;
            bottom:50px;
            height:100%;
            top:0;
            width:1px
        }
        .tree_li::after {
            border-top:1px solid #999;
            height:20px;
            top:25px;
            width:25px
        }

        .tree>ul>li::before, .tree>ul>li::after {
            border:0
        }

        .tree_li:last-child::before {
            height:25px
        }

    </style>`);
}

$(function () {
    addCSS();
});
