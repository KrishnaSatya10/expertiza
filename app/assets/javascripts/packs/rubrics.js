function addQuestionnaireTableRow(questionnaire_type, assignment_questionnaire, questionnaire, questionnaire_options, round_no, duty_id, duty_name) {
    var questionnaire_table = jQuery('#assignment_questionnaire_table>tbody>tr');
    var row_id = 'questionnaire_table_' + questionnaire_type;
    // E2147 : If duty_id is not undefined, add duty_id with the row_id to create a unique row id
    if (duty_id != undefined){
        row_id = row_id + duty_id
    }

    var i;
    var html = '<tr id=' + row_id + '>';
    html += '<input name="assignment_form[assignment_questionnaire][][assignment_id]" type="hidden" value="' + '<%= @assignment_form.assignment.id %>' +'">';

    // E2147 : Add duty_id as hidden input for this particular row so that it can be saved in assignment_questionnaire table
    if (duty_id != undefined) {
        html += '<input name="assignment_form[assignment_questionnaire][][duty_id]" type="hidden" value="' + duty_id +'">';
    }
    //Rubric name
    if (round_no == null && duty_id == undefined) {
        html += '<td><label for="questionnaire_id">' + questionnaire.display_type + ':</label></td>';
    } else if (round_no == null && duty_id != undefined) {
        // E2147 : Add name of duty infront of the questionnaire type to select for which duty the questionnaire is being selected
        html += '<td><label for="questionnaire_id">' + questionnaire.display_type +  ' Role ' + duty_name + ':</label></td>';
    }
    else if (round_no!=null && duty_id == undefined) {
        html += '<td><label for="questionnaire_id">' + questionnaire.display_type + ' Round '+ round_no + ':</label></td>';
    }
    //Rubric options
    html +=     '<td align="center">' +
    '<select id="questionnaire_id" name="assignment_form[assignment_questionnaire][][questionnaire_id]" style="width:300px" class="form-control">' +
    '<option value="">--None--</option>';
    for (i = 0; i < questionnaire_options.length; i++) {
        html += '<option value="' + questionnaire_options[i][1] + '">' + questionnaire_options[i][0] + '</option>';
    }
    html += '</select></td>';
    //Use dropdown instead
    html += '<td align="center"><input type="checkbox" name="dropdown" id="dropdown" value="true"></td>';
    //Scored question display type (Dropdown or Scale)
    html += '<td align="center"><select id="scored_question_display_type", name="assignment_form[assignment_questionnaire][][dropdown]" class="form-control">';
        if (assignment_questionnaire.dropdown == true) {
        html += '<option value=true selected="selected">Dropdown</option>';
        html += '<option value=false>Scale</option>';
        } else {
        html += '<option value=true>Dropdown</option>';
        html += '<option value=false selected="selected">Scale</option>';
        }
    html += '</select></td>';
    //Weight
    if (round_no == null || round_no == 1) {
        html += '<td align="center"><input name="assignment_form[assignment_questionnaire][][questionnaire_weight]" style="width:40px" type="text" value="' +
            assignment_questionnaire.questionnaire_weight + '">% </td>' +
            '<td align="center"><input name="assignment_form[assignment_questionnaire][][notification_limit]" style="width:40px" type="text" value="' +
            assignment_questionnaire.notification_limit + '">% </td>';
    } else {
        html += '<td align="center"><input name="assignment_form[assignment_questionnaire][][questionnaire_weight]" style="width:40px" type="text" value="' +
            0 + '">% </td>' +
            '<td align="center"><input name="assignment_form[assignment_questionnaire][][notification_limit]" style="width:40px" type="text" value="' +
            assignment_questionnaire.notification_limit + '">% </td>';
    }
    //Notification Limit 
    if (round_no == null) {
            html += '<td align="center"><input name="assignment_form[assignment_questionnaire][][used_in_round]" style="width:30px" type="hidden" value=""' + '"> </td>';
    } else {
            html += '<td align="center"><input name="assignment_form[assignment_questionnaire][][used_in_round]" style="width:30px" type="hidden" value="' + round_no + '"> </td>';
    }
    //insert menu for adding & selecting tag prompts
    <%if @assignment_form.assignment.is_answer_tagging_allowed %>
        tag_dropdown_index = 0
        placeholder_id = 'tag_prompt_placeholder_' + questionnaire.id
        deleted_input_id = getIdPrefix(questionnaire.id) + '[deleted][]'
        html += "<tr id='" + row_id + "_add_tag_prompt'>"
        html += "<td>Add tag prompts</td>"
        html += "<td colspan='6'><div id='" + placeholder_id + "'></div>"
        html += "<button type='button' class='btn btn-default' onClick='addTagPromptDropdown(\"" + placeholder_id + "\", undefined, " + questionnaire.id + ", " + null + ", " + 0 + ", " + 0 +")'>+Tag prompt+</button>"
        html += "<button type='button' class='btn btn-default' onClick='removeLastTagPromptDropdown(\"" + placeholder_id + "\",\"" + deleted_input_id + "\")'>-Tag prompt-</button>"
        html += "</td></tr>"
    <% end %>
    questionnaire_table.last().after(html);
    jQuery('#questionnaire_id').val(questionnaire.id).attr('id', '');
}
// start used for tag prompt
var tag_prompts = null
var q_types = null
function getIdPrefix(qs_id){
    prefix = 'assignment_form[tag_prompt_deployments]['
    if(qs_id!=null)
    return prefix + qs_id + ']'
    else
    return prefix + ']'
}
async function addTagPromptDropdown(placeholder_id, tag_dep_id, questionnaire_id, tag_prompt_id, question_type, text_len){
    $( "#" + placeholder_id ).append("<div id='loading_image'><img src='/assets/loading.gif' /></div>")
    q_types_filled = false
    tag_prompts_filled = false
    if(!q_types){
    $.ajax({
        dataType: "json",
        url: "../../questions/types",
        data: "",
        success: function(types){
        q_types = types
        q_types_filled = true
        }
    });
    }else
    q_types_filled = true
    if(!tag_prompts){
    $.ajax({
        dataType: "json",
        url: "../../tag_prompts",
        data: "",
        success: function(tp){
        tag_prompts = tp
        tag_prompts_filled = true
        }});
    }else
    tag_prompts_filled = true
    while(!(tag_prompts_filled || q_types_filled)){
    await sleep(2000);
    }
    $('#loading_image').remove()
    var id_prefix = getIdPrefix(questionnaire_id)
    var html = "<table><tr><td><div id='container_" + id_prefix + "'>"
    html += "<input type='hidden' name='" + id_prefix + "[id][]' value='" + tag_dep_id + "'>"
    html += "<div style='float: left;'>Tag prompt</div>"
    html += "<img src='/assets/info.png' title='Tag label that will be shown below the feedback' style='float: left;'/>"
    html += "&nbsp;<select name='" + id_prefix + "[tag_prompt][]' onchange='if (this.selectedIndex == 1)openAddNewTagPopup()' onfocus='if (this.selectedIndex == 1)this.selectedIndex = 0' class='form-control' style='float: left; max-width: 150px;'>"
    html += "<option value='none'>---</option>"
    html += "<option value='new'>add new..</option>"
    for (i=0; i<tag_prompts.length; i++) {
    html += "<option value=" + tag_prompts[i].id
    if (tag_prompt_id == tag_prompts[i].id)
        html += " selected "
    html += ">" + tag_prompts[i].prompt + "</option>"
    }
    html += "</select>"
    html += "<div style='float: left;'>&nbsp;&nbsp; apply to question type </div>"
    html += "<img src='/assets/info.png' title='The tag prompt will only be shown below the answers of this particular question type. It is useful to exclude types of question that the tags are not relevant to' style='float: left;'/>"
    html += "&nbsp;<select name='" + id_prefix + "[question_type][]' class='form-control' style='float: left;max-width: 150px;'>"
    for (i=0; i<q_types.length; i++) {
    html += "<option value=" + q_types[i]
    if (q_types[i] == question_type)
        html += " selected "
    html += ">" + q_types[i] + "</option>"
    }
    html += "</select>"
    html += "<div style='float: left;'>&nbsp;&nbsp; comment length threshold </div>"
    html += "<img src='/assets/info.png' title='This is only applicable to textual comments. The tag prompt will only be shown below textual comments whose length exceed the threshold. it is useful to exclude short comments that are not relevant' style='float: left;' />"
    html += "&nbsp;<input type='text' name='" + id_prefix + "[answer_length_threshold][]' size='4' value='" + text_len + "' style='float: left;'/>"
    html += "</div></td></tr></table>"
    $( "#" + placeholder_id ).append(html)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function removeLastTagPromptDropdown(placeholder_id, deleted_input_id){
    deleted_tag_dep_id = $("#"+placeholder_id+" div:last").parent().find('input[type="hidden"]')[0].value
    html = "<input type='hidden' name='" + deleted_input_id +"' value='"+ deleted_tag_dep_id +"' />"
    $("#" + placeholder_id + " div:last").parent().closest('table').remove()
    $("#" + placeholder_id).append(html)
}
function openAddNewTagPopup(){
    $.colorbox({
    iframe: true,
    href: "../../tag_prompts/view?popup=true",
    opacity: 0.8,
    innerWidth: 800,
    innerHeight: 500,
    transition:"fade",
    onClosed:function(){
        $.ajax({
        dataType: "json",
        url: "../../tag_prompts",
        data: "",
        success: function(tag_prompts){
            option = "<option value='none'>---</option><option value='new'>add new..</option>";
            //put all prompts including the newly added as options, find the highest id to be selected by default
            //This won't work if it's just an update
            last_added_id = 0;
            last_added_index = 0;
            for(i=0; i<tag_prompts.length; i++){
            if(tag_prompts[i].id>last_added_id){
                last_added_id = tag_prompts[i].id;
                last_added_index = i + 2;
            }
            option += "<option value='" + tag_prompts[i].id + "'";
            option += ">" + tag_prompts[i].prompt + "</option>";
            }
            //update all dropdown with the option, restore the selected option, unless for the dropdown that calls the popup
            $('select[name*="\\[tag_prompt\\]"]').each( function() {
            s = jQuery(this)
            s_value = s[0].options[s[0].selectedIndex].value;
            jQuery(this).empty().append(option);
            for(i=0; i<tag_prompts.length; i++){
                if(s_value == "new")
                s[0].selectedIndex = last_added_index;
                else if(s_value == tag_prompts[i].id.toString())
                s[0].selectedIndex = i + 2
            }
            });
        }});
    }
    });
}
<% unless @assignment_form.tag_prompt_deployments == nil %>
function initTagPrompts(){
    <% @assignment_form.tag_prompt_deployments.each do |tag_dep| %>
        addTagPromptDropdown('tag_prompt_placeholder_' + <%= tag_dep.questionnaire_id %>, <%= tag_dep.id %>, <%= tag_dep.questionnaire_id %>, <%= tag_dep.tag_prompt_id %>, '<%= tag_dep.question_type.to_s %>', <%= tag_dep.answer_length_threshold %>)
    <% end %>
}
initTagPrompts();
<%end%>
// end tag prompt code
function removeQuestionnaireTableRow(questionnaire_type, duty_id='') {
    var row_id = 'questionnaire_table_' + questionnaire_type + duty_id;
    jQuery('#' + row_id).remove();
    <%if @assignment_form.assignment.is_answer_tagging_allowed %>
    jQuery('#' + row_id + '_add_tag_prompt').remove();
    <%end%>
}
function metareview_due_date() {
    var metareview = document.getElementById("metareview_due_date_label");
    var dropdownIndex = document.getElementById('metareview_quest').selectedIndex;
    var dropdownValue = document.getElementById('metareview_quest')[dropdownIndex].value;
    if (dropdownValue != "0") {
        metareview.style.display = "";
    } else {
        metareview.style.display = "none";
    }
}

function addRubricsTableRows() {
    <% assignment_questionnaire = @assignment_form.assignment_questionnaire('MetareviewQuestionnaire', nil, nil) %>
    <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'MetareviewQuestionnaire') %>
    addQuestionnaireTableRow(
        'MetareviewQuestionnaire',
        <%= assignment_questionnaire.to_json.html_safe %>,
        <%= questionnaire.to_json.html_safe %>,
        <%= questionnaire_options('MetareviewQuestionnaire').to_json.html_safe %>,
        null, null, null
    );
    <% assignment_questionnaire = @assignment_form.assignment_questionnaire('AuthorFeedbackQuestionnaire', nil, nil) %>
    <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'AuthorFeedbackQuestionnaire') %>
    addQuestionnaireTableRow(
        'AuthorFeedbackQuestionnaire',
        <%= assignment_questionnaire.to_json.html_safe %>,
        <%= questionnaire.to_json.html_safe %>,
        <%= questionnaire_options('AuthorFeedbackQuestionnaire').to_json.html_safe %>,
        null, null, null
    );
    <% assignment_questionnaire = @assignment_form.assignment_questionnaire('TeammateReviewQuestionnaire', nil, nil) %>
    <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'TeammateReviewQuestionnaire') %>
    addQuestionnaireTableRow(
        'TeammateReviewQuestionnaire',
        <%= assignment_questionnaire.to_json.html_safe %>,
        <%= questionnaire.to_json.html_safe %>,
        <%= questionnaire_options('TeammateReviewQuestionnaire').to_json.html_safe %>,
        null, null, null
    );
}
//zhewei: varying rubric by round still not add 'BookmarkRatingQuestionnaire' yet.
function handleCheckReviewVaryByRound(checkvalue) {
    var state = checkvalue.checked;
    var round_count = <%= @assignment_form.assignment.rounds_of_reviews%>;
    if (state == true && round_count > 1){
        //Make it display by round
        ['ReviewQuestionnaire',
            'MetareviewQuestionnaire',
            'AuthorFeedbackQuestionnaire',
            'TeammateReviewQuestionnaire'].forEach(function(item){
            removeQuestionnaireTableRow(item);
        });
        <% 1.upto(@assignment_form.assignment.rounds_of_reviews) do |i| %>
        <% assignment_questionnaire = @assignment_form.assignment_questionnaire('ReviewQuestionnaire', i, nil) %>
        <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'ReviewQuestionnaire') %>
        addQuestionnaireTableRow(
            'ReviewQuestionnaire',
            <%= assignment_questionnaire.to_json.html_safe %>,
            <%= questionnaire.to_json.html_safe %>,
            <%= questionnaire_options('ReviewQuestionnaire').to_json.html_safe %>,
            <%= i %>, null, null
        );
        <% end %>
        addRubricsTableRows();
        <%@avoidrepeatsign=1%>;
    }
    if (state == false && round_count > 1) {
        //Make it display as usual
        ['ReviewQuestionnaire',
            'MetareviewQuestionnaire',
            'AuthorFeedbackQuestionnaire',
            'TeammateReviewQuestionnaire'].forEach(function (item) {
            if (item === 'ReviewQuestionnaire')
                for (i = 1; i <= round_count + 1; i++) {
                    removeQuestionnaireTableRow(item);
                }
            else removeQuestionnaireTableRow(item);
        });
        <% assignment_questionnaire = @assignment_form.assignment_questionnaire('ReviewQuestionnaire', nil, nil) %>
        <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'ReviewQuestionnaire') %>
        addQuestionnaireTableRow(
            'ReviewQuestionnaire',
            <%= assignment_questionnaire.to_json.html_safe %>,
            <%= questionnaire.to_json.html_safe %>,
            <%= questionnaire_options('ReviewQuestionnaire').to_json.html_safe %>,
            null, null, null
        );
        addRubricsTableRows();
        initTagPrompts();
    }
}

function handleCheckReviewVaryByDuty(checkvalue) {
    var state = checkvalue.checked;
    <%unless @duties.nil? or @duties.empty?%>
        if (state) {
            // make it display by duty
            removeQuestionnaireTableRow('TeammateReviewQuestionnaire')
            addDutyBasedQuestionnaires()
        } else {
            // loop as many times as number of duties, remove TeammateReviewQuestionnaire
            removeDutyBasedQuestionnaires();
            addDefaultTeammateReviewQuestionnaire();
        }
    <%end%>
}

function addDutyBasedQuestionnaires() {
    <%unless @duties.nil? or @duties.empty?%>
    // iterate over the available duties (roles) for the
    // for the assignment and add questionnaire table row.
        <% @duties.each do |duty| %>
        <% assignment_questionnaire = @assignment_form.assignment_questionnaire('TeammateReviewQuestionnaire', nil, nil, duty.id) %>
        <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'TeammateReviewQuestionnaire') %>

        addQuestionnaireTableRow(
            'TeammateReviewQuestionnaire',
            <%= assignment_questionnaire.to_json.html_safe %>,
            <%= questionnaire.to_json.html_safe %>,
            <%= questionnaire_options('TeammateReviewQuestionnaire').to_json.html_safe %>,
            null,
            '<%= duty.id %>',
            '<%= duty.name %>'
        );
        <% end %>
        <%@avoidrepeatsign=1%>;
    <%end%>
}
function removeDutyBasedQuestionnaires() {
    <%unless @duties.nil? or @duties.empty? %>
        // loop as many times as number of duties, remove TeammateReviewQuestionnaire for that duty
        <% @duties.each do |duty| %>
        removeQuestionnaireTableRow('TeammateReviewQuestionnaire', <%= duty.id %>);
        <% end %>
    <%end%>
}

function addDefaultTeammateReviewQuestionnaire() {
    // add the default TeammateReviewQuestionnaire
    <% assignment_questionnaire = @assignment_form.assignment_questionnaire('TeammateReviewQuestionnaire', nil, nil) %>
    <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'TeammateReviewQuestionnaire') %>
    addQuestionnaireTableRow(
        'TeammateReviewQuestionnaire',
        <%= assignment_questionnaire.to_json.html_safe %>,
        <%= questionnaire.to_json.html_safe %>,
        <%= questionnaire_options('TeammateReviewQuestionnaire').to_json.html_safe %>,
        null
    );
}
function toggleTeammateReviewDutyQuestionnaires(isVaryByDutyChecked) {
    if (isVaryByDutyChecked) {
        // remove existing default teammate review questionnaire
        removeQuestionnaireTableRow('TeammateReviewQuestionnaire');
        // add duty based questionnaires
        addDutyBasedQuestionnaires();
    } else {
        removeDutyBasedQuestionnaires();
        addDefaultTeammateReviewQuestionnaire();
    }
}

function insertTeamBasedElements(isTeamsAssignment) {
    var varyByDutyDiv = jQuery('#vary_by_duty');
    if (isTeamsAssignment) {
        varyByDutyDiv.removeAttr('hidden');
        var varyByDutyCheckbox = jQuery('#vary_by_duty_checkbox');
        if (varyByDutyCheckbox.is(':checked')) {
            addDutyBasedQuestionnaires();
        } else {
            addDefaultTeammateReviewQuestionnaire();
        }
    } else {
        // removing vary by duty div
        varyByDutyDiv.attr('hidden', true);
        // removing appropriate questionnaire rows
        removeDutyBasedQuestionnaires()
        removeQuestionnaireTableRow('TeammateReviewQuestionnaire');

    }
}

jQuery(document).ready(function () {
    // Adding an event listener to the team assignment checkbox.
    jQuery('#team_assignment').change(function() {
        insertTeamBasedElements(this.checked)
    });

    <% if @assignment_form.assignment.vary_by_round %>
    <% 1.upto(@assignment_form.assignment.rounds_of_reviews) do |i| %>
    <% assignment_questionnaire = @assignment_form.assignment_questionnaire('ReviewQuestionnaire', i, nil) %>
    <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'ReviewQuestionnaire') %>
    addQuestionnaireTableRow(
        'ReviewQuestionnaire',
        <%= assignment_questionnaire.to_json.html_safe %>,
        <%= questionnaire.to_json.html_safe %>,
        <%= questionnaire_options('ReviewQuestionnaire').to_json.html_safe %>,
        <%= i %>
    );
    <% end %>
    <% else %>
    <% assignment_questionnaire = @assignment_form.assignment_questionnaire('ReviewQuestionnaire', nil, nil) %>
    <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'ReviewQuestionnaire') %>
    addQuestionnaireTableRow(
        'ReviewQuestionnaire',
        <%= assignment_questionnaire.to_json.html_safe %>,
        <%= questionnaire.to_json.html_safe %>,
        <%= questionnaire_options('ReviewQuestionnaire').to_json.html_safe %>,
        null
    );
    <% end %>
    var metareview_allowed_checkbox = jQuery('#metareview_allowed');
    if (metareview_allowed_checkbox.is(':checked')) {
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
    <% assignment_questionnaire = @assignment_form.assignment_questionnaire('AuthorFeedbackQuestionnaire', nil, nil) %>
    <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'AuthorFeedbackQuestionnaire') %>
    addQuestionnaireTableRow(
        'AuthorFeedbackQuestionnaire',
        <%= assignment_questionnaire.to_json.html_safe %>,
        <%= questionnaire.to_json.html_safe %>,
        <%= questionnaire_options('AuthorFeedbackQuestionnaire').to_json.html_safe %>,
        null
    );

    var teamAssignmentCheckbox = jQuery('#team_assignment')
    insertTeamBasedElements(teamAssignmentCheckbox.is(':checked'))

    var bookmark_checkbox = jQuery('#assignment_form_assignment_use_bookmark');
    if (bookmark_checkbox.is(':checked')) {
        <% assignment_questionnaire = @assignment_form.assignment_questionnaire('BookmarkRatingQuestionnaire', nil, nil) %>
        <% questionnaire = @assignment_form.questionnaire(assignment_questionnaire, 'BookmarkRatingQuestionnaire') %>
        addQuestionnaireTableRow(
            'BookmarkRatingQuestionnaire',
            <%= assignment_questionnaire.to_json.html_safe %>,
            <%= questionnaire.to_json.html_safe %>,
            <%= questionnaire_options('BookmarkRatingQuestionnaire').to_json.html_safe %>,
            null
        );          }
});