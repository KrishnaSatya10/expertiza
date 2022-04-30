jQuery(document).ready(function () {
    jQuery("#set_rounds").click(function () {
        changeReviewRounds();
        jQuery("#set_pressed_bool").val(true)
        event.preventDefault(); // Prevent link from following its href
    });

    jQuery("#assignment_form_assignment_rounds_of_reviews").change(function () {
        jQuery("#set_pressed_bool").val(false)
    });


    //E1654. Improve date-picker and deadlines Code change starts
    //Hide date updater
    $("#date_updater_inner").hide();
    //This on-click function toggles date updater div
    jQuery("#show_date_updater").click(function () {

        $("#date_updater_inner").toggle();
    });
    //The functions below update the required parameter for the assignments that have their check-boxes marked for updation.

    //This function adds days to the date
    jQuery("#addDays_btn").click(function () {
//calls the function addDaysOrMonth
        addDaysOrMonth(1, "days");
        event.preventDefault();

    });

    //This function removes days from the date
    jQuery("#subDays_btn").click(function () {

        addDaysOrMonth(-1, "days");
        event.preventDefault();

    });


    //E1654. Improve date-picker and deadlines Code change starts

});

function addDueDateTableElement(addnameurl, deadline_type, round_no, due_date) {
//round_no = 0 for submission and review is not possible
//round_no = 0 is used for other deadlines
    var previous_element;
    if (round_no == 0) {
        if (deadline_type == 'team_formation') {
            if (jQuery('#signup').length != 0) {
                previous_element = jQuery("#signup");
            } else {
                previous_element = jQuery('#due_date_heading')
            }
        } else if (deadline_type == 'drop_topic') {
            if (jQuery('#team_formation').length != 0) {
                previous_element = jQuery("#team_formation");
            } else {
                previous_element = jQuery('#signup');
            }
        } else if (deadline_type == 'signup') {
            previous_element = jQuery('#due_date_heading')
        } else {
            previous_element = jQuery('#due_dates_table>tbody>tr:not(#due_date_heading)').last();
        }
        element_id = deadline_type;
        if (jQuery('#' + element_id).length != 0) {
            return
        }
    } else {
        if (deadline_type == 'submission') {
            if (round_no == 1) {
                previous_element = jQuery('#due_dates_table>tbody>tr:not(#due_date_heading)').last();
            } else {
                previous_element = jQuery('#review_round_' + (round_no - 1));
            }
        } else if (deadline_type == 'review') {
            previous_element = jQuery('#submission_round_' + round_no);
        } else {
        }
        element_id = deadline_type + '_round_' + round_no;
        if (jQuery('#' + element_id).length != 0) {
            return
        }
    }
    if (previous_element.length == 0) {
        return
    }
    var style_center = 'align="center" style="text-align-last: center"'

    var html = '<tr id=' + element_id + '>';

    var id = due_date.id
    if (id == null) {
        id = '';
    }
    html +=
        '<input name="assignment_form[due_date][][id]" type="hidden" value="' + id + '">';

    html += '<input class="due_date_assignment_id" name="assignment_form[due_date][][parent_id]" type="hidden" value="';
    html += '<%= @assignment_form.assignment.id %>';
    html += '">' +
        '<input class="due_date_round" name="assignment_form[due_date][][round]" type="hidden" value="' + round_no + '">' +
        '<input class="due_date_deadline_type_id" name="assignment_form[due_date][][deadline_type_id]" type="hidden" value="' + due_date.deadline_type_id + '">';

    html += '<td class="due_date_name" width="15%">';
    if (round_no != 0) {
        html += 'Round ' + round_no + ': ' + capitalize(deadline_type);
    } else {
        html += capitalize(deadline_type.replace("_", " "));
    }
    html += '</td>';
    var due_at = due_date.due_at;
    if (due_at == null) {
        due_at = '';
    } else {
        var tzone = due_at.substr(23, 6);
        if (tzone == 'Z') {
            tzone = '+00:00';
        }
        var timezone = "(UTC " + tzone.toString() + ")";
        due_at = due_at.substr(0, 4) + '/' + due_at.substr(5, 2) + '/' + due_at.substr(8, 2) + ' ' + due_at.substr(11, 2) + ':' + due_at.substr(14, 2) + ' ' + timezone;
    }
    var due_name = due_date.deadline_name;
    if (due_name == null) {
        due_name = '';
    }

    html += '<td ' + style_center +' class="due_date_due_at">' +
        '<input id="datetimepicker_' + element_id +
        '" name="assignment_form[due_date][][due_at]"  type="text" style="width: 140px;text-align:center;" value="' +
        due_at.substr(0, 16) + '" class="form-control">' + '</td>';
    html += '<td align="center" class="due_date_due_at" width="5%">' + '<input id="use_updator_' + element_id +
        '" type="checkbox" name="updatorCheck" style="width: 20px">' + '</td>';

    html += '<td ' + style_center + ' class="due_date_due_at" width="10%">';
    // if(deadline_type == 'team_formation'){
    //     html += '<select id="due_date_submission_allowed_id" name="assignment_form[due_date][][submission_allowed_id]" disabled>'
    // }
    // else{
    html += '<select id="due_date_submission_allowed_id" name="assignment_form[due_date][][submission_allowed_id]" class="form-control" style="width: 75px">'
    // }
    html +=
        '<option value="1">No</option>' +
        '<option value="2">Late</option>' +
        '<option value="3">Yes</option>' +
        '</select></td>';

    html += '<td '  + style_center + ' class="due_date_review_allowed_id" width="10%">';
    // if(deadline_type == 'team_formation'){
    //     html += '<select id="due_date_review_allowed_id" name="assignment_form[due_date][][review_allowed_id]" disabled>'
    // }
    // else{
    html += '<select id="due_date_review_allowed_id" name="assignment_form[due_date][][review_allowed_id]" class="form-control" style="width: 75px">'
    // }
    html +=
        '<option value="1">No</option>' +
        '<option value="2">Late</option>' +
        '<option value="3">Yes</option>' +
        '</select></td>';

    html += '<td '  + style_center +  ' class="due_date_teammate_review_allowed_id" width="10%">';
    html += '<select id="due_date_teammate_review_allowed_id" name="assignment_form[due_date][][teammate_review_allowed_id]" class="form-control" style="width: 75px">'
    html +=
        '<option value="1">No</option>' +
        '<option value="2">Late</option>' +
        '<option value="3">Yes</option>' +
        '</select></td>';

    html += '<td '  + style_center +  ' class="due_date_review_of_review_allowed_id" width="10%">';
    // if(deadline_type == 'team_formation'){
    //     html += '<select id="due_date_review_of_review_allowed_id" name="assignment_form[due_date][][review_of_review_allowed_id]" disabled>'
    // }
    // else{
    html += '<select id="due_date_review_of_review_allowed_id" name="assignment_form[due_date][][review_of_review_allowed_id]" class="form-control" style="width: 75px">'
    // }
    html +=
        '<option value="1">No</option>' +
        '<option value="2">Late</option>' +
        '<option value="3">Yes</option>' +
        '</select></td>';

    if (<%= @assignment_form.assignment.require_quiz == nil ? false : @assignment_form.assignment.require_quiz %>) {
        html += '<td ' + style_center + ' class="due_date_quiz_allowed_id" width="10%">' +
            '<select id="due_date_quiz_allowed_id" name="assignment_form[due_date][][quiz_allowed_id]" class="form-control" style="width: 75px">' +
            '<option value="1">No</option>' +
            '<option value="2">Late</option>' +
            '<option value="3">Yes</option>' +
            '</select></td>';
    } else {
    }

    html += '<td '  + style_center + ' class="due_date_threshold" width="10%">' +
        '<select id="due_date_threshold" name="assignment_form[due_date][][threshold]" class="form-control" style="width: 75px">' +
        '<option value="">No</option>' +
        '<option value="1">1</option>' +
        '<option value="8">8</option>' +
        '<option value="16">16</option>' +
        '<option value="24">24</option>' +
        '<option value="32">32</option>' +
        '<option value="40">40</option>' +
        '<option value="48">48</option>' +
        '<option value="56">56</option>' +
        '<option value="64">64</option>' +
        '<option value="72">72</option>' +
        '<option value="80">80</option>' +
        '<option value="88">88</option>' +
        '<option value="96">96</option>' +
        '</select></td>';
    var html2 = html;

    html += '<td ' + style_center + ' id="specialname" class="due_date_name" width="10%">';
    html += '<input id="due_date_name" type="text" name="assignment_form[due_date][][deadline_name]" value="' + due_date.deadline_name + '" class="form-control">' + '</td>';
    html += '<td ' + style_center + ' id="due_date_url_col" class="due_date_description_url" width="10%">';
    html += '<input id="due_date_description_url" type="text" name="assignment_form[due_date][][description_url]" value="' + due_date.description_url + '" class="form-control">' + '</td>';
    if (addnameurl == false) {
        previous_element.after(html2);
    } else {
        previous_element.after(html);
    }

    jQuery('#due_date_submission_allowed_id').val(due_date.submission_allowed_id).attr('id', '');
    jQuery('#due_date_review_allowed_id').val(due_date.review_allowed_id).attr('id', '');
    jQuery('#due_date_review_of_review_allowed_id').val(due_date.review_of_review_allowed_id).attr('id', '');
    jQuery('#due_date_quiz_allowed_id').val(due_date.quiz_allowed_id).attr('id', '');
    jQuery('#due_date_teammate_review_allowed_id').val(due_date.teammate_review_allowed_id).attr('id', '');
    jQuery('#due_date_threshold').val(due_date.threshold).attr('id', '');
    jQuery('#due_date_name').val(due_date.deadline_name).attr('id', '');
    jQuery('#due_date_description_url').val(due_date.description_url).attr('id', '');

    jQuery('#datetimepicker_' + element_id).datetimepicker({
        format: 'YYYY/MM/DD HH:mm z',
        sideBySide: true
    });
}

function removeDueDateTableElement(deadline_type, round_no) {
    var element_id;
    if (round_no == 0) {
        element_id = '#' + deadline_type;
    } else {
        element_id = '#' + deadline_type + '_round_' + round_no;
    }
    jQuery(element_id).remove();
}

function changeReviewRounds() {
    var new_round_count = parseInt(jQuery('#assignment_form_assignment_rounds_of_reviews').val());

    var submissions_count = <%= @num_submissions_round %>;
    var reviews_count = <%= @num_reviews_round %>;
    if (new_round_count <= 0) {
        alert('ERROR: number of rounds of review should be greater than 0');
        return
    }

    var confirm_flag = true
    var i;
    var due_dates_table_element_list = jQuery('#due_dates_table>tbody>tr:not(#due_date_heading)');
    var current_round_count = 0;
    var round_no;
    for (i = 0; i < due_dates_table_element_list.length; i++) {
        round_no = parseInt(due_dates_table_element_list[i].id.split('_').slice(-1)[0]);
        if (!isNaN(round_no)) {
            if (current_round_count < round_no) {
                current_round_count = round_no;
            }
        }
    }

    var original_round_count = <%= @assignment_form.assignment.rounds_of_reviews%>;

    if (new_round_count < reviews_count) {
        jQuery.confirm({
            title: 'Confirmation required.',
            content: 'Are you sure you want to reduce the number of review round?',
            buttons: {
                confirm: function () {
                    $.alert('Round of reviews updated!');
                },
                cancel: function () {
                    jQuery('#assignment_form_assignment_rounds_of_reviews').val(original_round_count);
                    $('#set_rounds').click();
                    confirm_flag = false;
                }
            }
        });
    }

    if (confirm_flag) {
        if (new_round_count == current_round_count) {
            return
        }
        if (new_round_count >= original_round_count && current_round_count < original_round_count) {
            //make sure all the rounds are already displayed
            <% for i in 1..@assignment_form.assignment.rounds_of_reviews %>
            addDueDateTableElement(false, 'submission', <%=i%>, <%= due_date(@assignment_form.assignment,'submission', i-1).to_json.html_safe %>);
            addDueDateTableElement(false, 'review', <%=i%>, <%= due_date(@assignment_form.assignment,'review', i-1).to_json.html_safe %>);
            <% end %> //use ruby because i need the i variable... @_@ unfortunate but dunno how to get around
            //dont worry the addDueDateTableElement function check to see if it exist first before doing anything
        }
        if (new_round_count < current_round_count) {
            for (i = new_round_count + 1; i <= current_round_count; i++) {
                removeDueDateTableElement('submission', i);
                removeDueDateTableElement('review', i);
            }
        }
        if (new_round_count > current_round_count) {
            for (i = original_round_count + 1; i <= new_round_count; i++) {
                addDueDateTableElement(false, 'submission', i, <%= due_date(@assignment_form.assignment,'submission', -1).to_json.html_safe%>);
                addDueDateTableElement(false, 'review', i, <%= due_date(@assignment_form.assignment,'review', -1).to_json.html_safe%>);
            }
        }
    }
}

function handleChangenameurl(checkvalue, due_date_name_column, due_date_url_column) {
    var state = checkvalue;
    var round_count = <%= @assignment_form.assignment.rounds_of_reviews%>;
    if (!document.getElementById) {
        return;
    }
    if (state == false && round_count > 1) {
        //hide name and url columns
        removeDueDateTableElement('team_formation', 0);
        for (i = 1; i <= round_count; i++) {
            removeDueDateTableElement('submission', i);
            removeDueDateTableElement('review', i);
        }
        removeDueDateTableElement('metareview', 0);
        addDueDateTableElement(false, 'team_formation', 0, <%= due_date(@assignment_form.assignment,'team_formation', 0).to_json.html_safe %>);
        <% for i in 1..@assignment_form.assignment.rounds_of_reviews %>
        addDueDateTableElement(false, 'submission', <%=i%>, <%= due_date(@assignment_form.assignment,'submission', i-1).to_json.html_safe %>);
        addDueDateTableElement(false, 'review', <%=i%>, <%= due_date(@assignment_form.assignment,'review', i-1).to_json.html_safe %>);
        <% end %>
        addDueDateTableElement(false, 'metareview', 0, <%= due_date(@assignment_form.assignment,'metareview', 0).to_json.html_safe%>);

        due_date_name_column.style.display = "none";
        due_date_url_column.style.display = "none";
    }
    if (state == true && round_count > 1) {
        //display name and url columns
        removeDueDateTableElement('team_formation', 0);
        for (i = 1; i <= round_count; i++) {
            removeDueDateTableElement('submission', i);
            removeDueDateTableElement('review', i);
        }
        removeDueDateTableElement('metareview', 0);
        addDueDateTableElement(true, 'team_formation', 0, <%= due_date(@assignment_form.assignment,'team_formation', 0).to_json.html_safe %>);
        <% for i in 1..@assignment_form.assignment.rounds_of_reviews %>
        addDueDateTableElement(true, 'submission', <%=i%>, <%= due_date(@assignment_form.assignment,'submission', i-1).to_json.html_safe %>);
        addDueDateTableElement(true, 'review', <%=i%>, <%= due_date(@assignment_form.assignment,'review', i-1).to_json.html_safe %>);
        <% end %>
        addDueDateTableElement(true, 'metareview', 0, <%= due_date(@assignment_form.assignment,'metareview', 0).to_json.html_safe %>);

        due_date_name_column.removeAttribute("style");
        due_date_url_column.removeAttribute("style");
    } else {

    }
}

function removeOrAddMetareview() {
    if (document.getElementById("metareview")) {
        removeDueDateTableElement('metareview', 0);
        jQuery("#questionnaire_table_MetareviewQuestionnaire").remove()
    } else {
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'metareview', 0, <%= due_date(@assignment_form.assignment, 'metareview').to_json.html_safe %>);
        jQuery("#questionnaire_table_MetareviewQuestionnaire").remove()
        <% assignment_questionnaire = @assignment_form.assignment_questionnaire('MetareviewQuestionnaire', nil, nil) %>
        <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'MetareviewQuestionnaire') %>
        addQuestionnaireTableRow(
            'MetareviewQuestionnaire',
            <%= assignment_questionnaire.to_json.html_safe %>,
            <%= questionnaire.to_json.html_safe %>,
            <%= questionnaire_options('MetareviewQuestionnaire').to_json.html_safe %>,
            null
        );
    }

    <%@metareview_allowed_checkbox=true%>

}

function removeOrAddSignup() {
    if (document.getElementById("signup"))
        removeDueDateTableElement('signup', 0);
    else
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'signup', 0, <%= due_date(@assignment_form.assignment, 'signup').to_json.html_safe %>);

    <%@signup_allowed_checkbox=true%>

}

function removeOrAddDropTopic() {
    if (document.getElementById("drop_topic"))
        removeDueDateTableElement('drop_topic', 0);
    else
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'drop_topic', 0, <%= due_date(@assignment_form.assignment, 'drop_topic').to_json.html_safe %>);

    <%@drop_topic_allowed_checkbox=true%>

}

function removeOrAddTeamFormation() {
    if (document.getElementById("team_formation"))
        removeDueDateTableElement('team_formation', 0);
    else
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'team_formation', 0, <%= due_date(@assignment_form.assignment, 'team_formation').to_json.html_safe %>);

    <%@team_formation_allowed_checkbox=true%>

}

function removeOrAddMetareview() {
    if (document.getElementById("metareview")) {
        removeDueDateTableElement('metareview', 0);
        jQuery("#questionnaire_table_MetareviewQuestionnaire").remove()
    } else {
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'metareview', 0, <%= due_date(@assignment_form.assignment, 'metareview').to_json.html_safe %>);
        jQuery("#questionnaire_table_MetareviewQuestionnaire").remove()
        <% assignment_questionnaire = @assignment_form.assignment_questionnaire('MetareviewQuestionnaire', nil, nil) %>
        <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'MetareviewQuestionnaire') %>
        addQuestionnaireTableRow(
            'MetareviewQuestionnaire',
            <%= assignment_questionnaire.to_json.html_safe %>,
            <%= questionnaire.to_json.html_safe %>,
            <%= questionnaire_options('MetareviewQuestionnaire').to_json.html_safe %>,
            null
        );
    }
    <%@metareview_allowed_checkbox=true%>
}

# //E1654. Improve date-picker and deadlines Code change starts
# //This is a generic function to add and subtract days and months
function addDaysOrMonth(mul, type) {
    var days = parseInt($('#days').val(), 10); // days variable stores the number of days to change the deadline
    var months = parseInt($('#months').val(), 10);  // days variable stores the number of days to change the deadline
    for (var i = 1; i < jQuery('#due_dates_table>tbody>tr:not(#due_date_heading)').length / 2; i++) {
        if ($('#use_updator_review_round_' + i).is(':checked')) {
            var date = $('#datetimepicker_review_round_' + i).val().split("/");
            // curDate reads the date currently in the field
            var curDate = new Date(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2].split(" ")[0], 10));
            if (type == "days") {//checks if type is date then sets dates
                curDate.setDate(curDate.getDate() + (days * mul));//sets the date
            } else {
                curDate.setMonth(curDate.getMonth() + (months * mul));//sets the months
            }
            $("#datetimepicker_review_round_" + i).val(curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + curDate.getDate() + " " + date[2].split(" ")[1]);
        }
        if ($('#use_updator_submission_round_' + i).is(':checked')) {
            var date = $('#datetimepicker_submission_round_' + i).val().split("/");
            var curDate = new Date(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2].split(" ")[0], 10));
            if (type == "days") {
                curDate.setDate(curDate.getDate() + (days * mul));
            } else {
                curDate.setMonth(curDate.getMonth() + (months * mul));
            }
            $("#datetimepicker_submission_round_" + i).val(curDate.getFullYear() + "/" + (curDate.getMonth() + 1) + "/" + curDate.getDate() + " " + date[2].split(" ")[1]);
        }
    }


}

# //E1654. Improve date-picker and deadlines Code change ends

<script>
    function addTeamInformation() {
        <% if @assignment_form.assignment.team_assignment? && due_date(@assignment_form.assignment, 'team_formation').due_at %>
        addDueDateTableElement(<%= @due_date_nameurl_not_empty.nil? ? false:@due_date_nameurl_not_empty %>, 'team_formation', 0, <%= due_date(@assignment_form.assignment, 'team_formation').to_json.html_safe %>);
        <% end %>
    }
    jQuery(document).ready(function () {
        addTeamInformation()
        <% if @assignment_form.assignment.topics? %>
        <% if due_date(@assignment_form.assignment, 'signup').due_at %>
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'signup', 0, <%= due_date(@assignment_form.assignment, 'signup').to_json.html_safe %>);
        <% end %>
        <% if due_date(@assignment_form.assignment, 'drop_topic').due_at %>
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'drop_topic', 0, <%= due_date(@assignment_form.assignment, 'drop_topic').to_json.html_safe %>);
        <% end %>
        <% end %>
        <% 1.upto @assignment_form.assignment.rounds_of_reviews do |i| %>
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'submission', <%=i%>, <%= due_date(@assignment_form.assignment, 'submission', i-1).to_json.html_safe %>); // or use questionnaire_options(@assignment, nil).to_json
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'review', <%=i%>, <%= due_date(@assignment_form.assignment, 'review', i-1).to_json.html_safe %>);
        <% end %>
        <% if @metareview_allowed %>
        addDueDateTableElement(<%= @due_date_nameurl_not_empty==nil ? false:@due_date_nameurl_not_empty %>, 'metareview', 0, <%= due_date(@assignment_form.assignment, 'metareview').to_json.html_safe %>);
        <%end %>

        //after webpage refreshes, hide or display name and url according to whether names and urls are empty in DB
        var due_date_name_column = document.getElementById("due_date_name_column");
        var due_date_url_column = document.getElementById("due_date_url_column");
        <% if @due_date_nameurl_not_empty.nil? or @due_date_nameurl_not_empty.eql? false %>
        due_date_name_column.style.display = "none";
        due_date_url_column.style.display = "none";
        <% end %>

    }());
</script>