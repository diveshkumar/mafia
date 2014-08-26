<?php
/**
 * @package PII
 * @file
 *  This file will handle the Menu links for option pages.
 */

/**
 * Class Representing Menu Handler.
 */
class MenuHandler {

  public function __construct() {
    // Doing nothing.
  }

  /**
   * @method
   * Returning Menu options.
   */
  public function createMenu() {
    //create new top-level menu
    add_menu_page('PII Settings', 'PII Settings', 'administrator', __FILE__, array($this, 'settingsPage'));
  }
  /**
   * Creating a settings page for PII options.
   */
  public function settingsPage() {
    // Handling the submit for settings page.
    $this->_submitHandler();
    // Getting Default values for the fields.
    $fields = get_option('pii_fields');
    
    ?>
    <div class="wrap">
      <h2><?php echo __('PII Settings'); ?></h2>
      <p><?php echo __('Select the fields you want to be encrypted while storing in database.'); ?></p>
      <form name='pii-settings-form' method='post'>
        <input type='hidden' name='type' value='pii_settings' />
        <?php
        $options = $this->getFields();
        
        foreach ($options as $id => $label) {
          $is_checked = !empty($fields) ? (in_array($id, $fields) ? " checked": "") : '';
          ?>
          <div><label for='<?php print $id; ?>'><input type='checkbox' name='options[]' value='<?php print $id; ?>' <?php print $is_checked;?> /> <?php print $label; ?></label><br/></div>
        <?php
        }
        print submit_button();
        ?>
      </form>
    </div>
    <?php
  }
  
  /**
   * Submit handler for PII settings through settings page.
   */
  private function _submitHandler() {
    // Checking if this is a valid settings submit handler.
    if (!empty($_POST) && isset($_POST['type']) && $_POST['type'] == 'pii_settings') {
      update_option('pii_fields', $_POST['options']);
      $encryption = new EncryptDecrypt();
      $encryption->updateFields($_POST['options']);
    }
  }

  /**
   * @method
   * This method would return list fields to be shown on settings page.
   */
  public function getFields($key = FALSE) {
    $fields = array(
      'meta_first_name' => __('First Name'),
      'meta_last_name' => __('Last Name'),
      'user_email'    => __('Email ID'),
      'display_name'  => __('Display Name')
    );
    
    return ($key === TRUE) ?  array_keys($fields) : $fields;
  }

}

$menuHandler = new MenuHandler();
// Registring menu.
add_action('admin_menu', array($menuHandler, 'createMenu'));
