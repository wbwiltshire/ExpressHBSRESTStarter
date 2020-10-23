$(document).ready(function () {
    var baseUrl = '/api/';

    $('#refresh').click(function () {
        CustomerList();
    });

    //CustomerList();

    function CustomerList() {
        var url = baseUrl + 'customer/';
        var grid = 'CustomerList';
        var template = 'customerListHGrid';
        ajaxGet({
            url: url,
            success: function (result) {
                jsonresult = result;
                bindGrid(grid, template, result);
            }
        });
    }

    function bindGrid(grid, src, data) {
        var result = '{"' + grid + '":' + JSON.stringify(data) + "}";
        var source = $('#' + src).html();
        var template = Handlebars.compile(source);
        var html = template(JSON.parse(result));
        $("#" + grid).html(html);
        if (data.length < 1) {
            $("#noRecordsFound").removeAttr('Style', 'display');
        }
        else {
            $("#noRecordsFound").css('display', 'none');
        }
    }

});